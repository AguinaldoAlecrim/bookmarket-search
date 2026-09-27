(function () {
    // 0. Limpeza de instâncias anteriores (Garante unicidade)
    var existingPanel = document.getElementById("rsp");
    if (existingPanel) {
        existingPanel.remove();
        document.querySelectorAll("span.rh").forEach(function (s) {
            var pn = s.parentNode;
            pn.replaceChild(document.createTextNode(s.textContent), s);
            pn.normalize();
        });
    }

    // 1. Coleta de parâmetros do usuário
    var p = prompt("Insira a expressão regular:");
    if (!p) return;
    var f = prompt("Insira as flags (ex: gi):", "gi");
    if (!f) return;

    try {
        // 2. Configuração da Expressão Regular e busca de nós de texto
        var re = new RegExp(p, f);
        var w = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false,
        );
        var n,
            h = [],
            tn = [];

        while ((n = w.nextNode())) {
            if (
                n.parentElement &&
                n.parentElement.tagName != "SCRIPT" &&
                n.parentElement.tagName != "STYLE"
            ) {
                tn.push(n);
            }
        }

        // 3. Processamento e criação dos destaques no DOM
        tn.forEach(function (t) {
            var txt = t.nodeValue,
                m,
                li = 0,
                fr = document.createDocumentFragment(),
                hm = false;
            re.lastIndex = 0;

            while ((m = re.exec(txt)) !== null) {
                if (m.index === re.lastIndex) {
                    re.lastIndex++;
                    continue;
                }
                hm = true;
                if (m.index > li)
                    fr.appendChild(
                        document.createTextNode(txt.substring(li, m.index)),
                    );

                var s = document.createElement("span");
                s.className = "rh";
                s.textContent = m[0];
                s.style.cssText =
                    "background:#ff0;color:#000;border:1px solid #f90;padding:0 2px;border-radius:3px;";
                fr.appendChild(s);
                h.push(s);
                li = re.lastIndex;
            }

            if (hm) {
                if (li < txt.length)
                    fr.appendChild(document.createTextNode(txt.substring(li)));
                t.parentNode.replaceChild(fr, t);
            }
        });

        if (h.length === 0) {
            alert("Nenhuma ocorrência encontrada.");
            return;
        }

        // 4. Lógica de navegação e atualização do painel
        var ci = -1;

        function go(d) {
            if (ci >= 0) h[ci].style.background = "#ff0";
            ci = (ci + d + h.length) % h.length;
            h[ci].style.background = "#f90";
            h[ci].scrollIntoView({ behavior: "smooth", block: "center" });
            up();
        }

        function goTo(i) {
            if (ci >= 0) h[ci].style.background = "#ff0";
            ci = i;
            h[ci].style.background = "#f90";
            h[ci].scrollIntoView({ behavior: "smooth", block: "center" });
            up();
        }

        function up() {
            wc.textContent = ci + 1 + "/" + h.length;
            inp.value = ci + 1;
        }

        // 5. Criação e estilização do painel flutuante
        var wd = document.createElement("div");
        wd.id = "rsp"; // Identificador único para controle de instância
        wd.style.cssText =
            "position:fixed;bottom:20px;right:20px;background:#333;color:#fff;padding:10px 15px;border-radius:8px;z-index:2147483647;font-family:sans-serif;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.4);display:flex;align-items:center;gap:10px;";

        var wc = document.createElement("span");
        wc.textContent = "1/" + h.length;

        var bp = document.createElement("button");
        bp.textContent = "Anterior";
        bp.style.cssText =
            "cursor:pointer;padding:5px 10px;border:none;border-radius:4px;background:#555;color:#fff;";

        var bn = document.createElement("button");
        bn.textContent = "Próximo";
        bn.style.cssText =
            "cursor:pointer;padding:5px 10px;border:none;border-radius:4px;background:#555;color:#fff;";

        var inp = document.createElement("input");
        inp.type = "number";
        inp.min = "1";
        inp.max = h.length;
        inp.value = "1";
        inp.style.cssText =
            "width:60px;padding:5px;border:1px solid #555;border-radius:4px;background:#222;color:#fff;text-align:center;";

        var bg = document.createElement("button");
        bg.textContent = "Ir";
        bg.style.cssText =
            "cursor:pointer;padding:5px 10px;border:none;border-radius:4px;background:#07a;color:#fff;";

        var bc = document.createElement("button");
        bc.textContent = "Fechar";
        bc.style.cssText =
            "cursor:pointer;padding:5px 10px;border:none;border-radius:4px;background:#d33;color:#fff;";

        // 6. Atribuição de eventos
        bp.onclick = function () {
            go(-1);
        };
        bn.onclick = function () {
            go(1);
        };

        bg.onclick = function () {
            var v = parseInt(inp.value);
            if (v >= 1 && v <= h.length) {
                goTo(v - 1);
            } else {
                alert("Insira um número entre 1 e " + h.length);
            }
        };

        inp.onkeypress = function (e) {
            if (e.key === "Enter") {
                bg.onclick();
            }
        };

        bc.onclick = function () {
            wd.remove();
            h.forEach(function (s) {
                var pn = s.parentNode;
                pn.replaceChild(document.createTextNode(s.textContent), s);
                pn.normalize();
            });
        };

        // 7. Inserção do painel no DOM e inicialização
        wd.appendChild(wc);
        wd.appendChild(bp);
        wd.appendChild(bn);
        wd.appendChild(inp);
        wd.appendChild(bg);
        wd.appendChild(bc);
        document.body.appendChild(wd);

        go(1);
    } catch (e) {
        alert("Erro na expressão regular: " + e.message);
    }
})();
