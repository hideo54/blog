# blog

Blog system for hideo54. Now in development.

**The name and url of this system and repository might be changed after this version.**

## Version

v0.1 (2017/6/5)

The page generated by current version displays only title, some links, and
a message saying "This blog is under development.".

Release date of v1.0, comfortable version for production, is not strictly
decided. Development of the version is proceeded on
[`dev` branch](https://github.com/hideo54/blog/tree/dev).

## Planned features

* **Fast**: consists of only static files.
* **No PHP**: made only with Node.js; requires only Node.js, yarn (or npm),
and pm2 (or something).
* **Simple design**
* **Using pug for markup**
* **Syntax-highlighting support**
* **Detailed access-analysis support**
: by both Google Analytics and original system.
* **Two languages support**: Japanese and English.
* **AMP (Accelerated Mobile Pages) support**
* **Better SEO (Search Engine Optimization) support**
* **Useful for everyone**: common files include no preferences;
preferences are managed as git-ignored files for much easier customization.

## Build

1. `yarn`
1. `cp config-sample.json config.json` and edit `config.json` as you like.
1. `yarn run build`
1. Now all necessary files are generated in `dist/` directory.

## License

Apache-2.0

## Contact

* Twitter: [@hideo54](https://twitter.com/hideo54)
* Email: contact@hideo54.com
