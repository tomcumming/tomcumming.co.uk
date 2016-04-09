all: theme.css script.js

theme.css: theme.scss
	sass theme.scss theme.css

script.js: tsconfig.json script.ts animations.ts
	tsc -p tsconfig.json

clean:
	rm script.js theme.css theme.css.map
