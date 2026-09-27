# DESCRIÇÃO

Este projeto é de um bookmarklet para procurar texto na página usando RegEx.

# GERANDO

Para gerar o bookmarklet é preciso ter o `terser` instalado e executar o seguinte comando:

```bash
 terser main.js -c -m -o bookmarklet.js
```

**ATENÇÃO:** é preciso inserir a partícula `javascript:` no início do código antes de salvá-lo como bookmarklet.
