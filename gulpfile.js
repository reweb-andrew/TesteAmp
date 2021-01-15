const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const twig = require('gulp-twig');
const { argv } = require('yargs');
const fs = require('fs');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

// Varivel para alterar o tema
//const theme = 'template-01';

// Task responsavel por compilar o scss para css
gulp.task('sass', () => {
  return gulp
    .src(`themes/${arg.theme}/assets/css/sass/*.scss`)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest(`themes/${arg.theme}/assets/css/`))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});

// Task responsavel por gerar o compilar o twig
gulp.task('html', async () => {
  return gulp
    .src([`themes/${arg.theme}/pages/*.htm`])
    .pipe(
      twig({
        errorLogToConsole: true,
        base: `themes/${arg.theme}/`,
        functions: [
          {
            name: 'source',
            func(json) {
              return fs.readFileSync(`themes/${arg.theme}/${json}`);
            }
          }
        ],
        filters: [
          {
            'name': 'page',
            func(val) {
              return val;
            }
          },
          {
            'name': 'link',
            func(val, pdr) {
              if (val != '') {
                return val;
              } else {
                return pdr;
              }
            }
          },
          {
            'name': 'trans',
            func(val, pdr) {
              if (val.value != '') {
                return val.value;
              } else {
                return pdr;
              }

            }
          },
          {
            name: 'json_decode',
            func(json) {
              return JSON.parse(json);
            }
          },
          {
            name: 'vehicle_dealers_page',
            func(page, vehicle) {
              return page;
            }
          },
          {
            name: 'vehicle_seminovo_page',
            func(page, vehicle) {
              return page;
            }
          },
          {
            name: 'highlight_page',
            func(page, highlight) {
              return page;
            }
          },
          {
            name: 'product_page',
            func(page, product) {
              return page;
            }
          },
          {
            name: 'about_page',
            func(page, about) {
              return page;
            }
          },
          {
            name: 'news_page',
            func(page, news) {
              return page;
            }
          },
          {
            name: 'news_detail_page',
            func(page, news) {
              return page;
            }
          },
          {
            name: 'list_car_page',
            func(page, veihcles) {
              return page;
            }
          },
          {
            name: 'list_semi_page',
            func(page, seminovos) {
              return page;
            }
          },
          {
            name: 'venda_direta_page',
            func(page, venda) {
              return page;
            }
          },
          {
            name: 'test_drive_page',
            func(page, test) {
              return page;
            }
          },
          {
            name: 'pcd_page',
            func(page, pcd) {
              return page;
            }
          },
          {
            name: 'compra_certa_page',
            func(page, compra) {
              return page;
            }
          },
          {
            name: 'frotista_locador_page',
            func(page, frotista) {
              return page;
            }
          },
          {
            name: 'pessoa_juridica_page',
            func(page, juridica) {
              return page;
            }
          },
          {
            name: 'revisao_page',
            func(page, revisao) {
              return page;
            }
          },
          {
            name: 'servico_page',
            func(page, servico) {
              return page;
            }
          },
          {
            name: 'only_number',
            func(str) {
              return str.replace(/[^0-9.]/g, '');
            }
          },
          {
            name: 'vehicle_dealers_title',
            func(str) {
              return str;
            }
          },
          {
            name: 'vehicle_dealers_description',
            func(str) {
              return str;
            }
          },
          {
            name: 'product_title',
            func(str) {
              return str;
            }
          },
          {
            name: 'product_description',
            func(str) {
              return str;
            }
          }
        ]
      })
    )
    .pipe(gulp.dest('./dist/'));
});

// Task que move as imagens de /assets/img para ./dist/src/imagens
gulp.task('src', () => {
  return gulp
    .src(`themes/${arg.theme}/assets/img/**.*`)
    .pipe(gulp.dest('./dist/assets/img/'));
});

const createTmp = argv.create !== undefined;

// Tast para criar um novo template
gulp.task('theme', () => {
  return gulp
    .src(`./themes/${argv.copy}/**`)
    .pipe(gulp.dest(`./themes/${argv.name}`));
});

// task do Server...
gulp.task('serve', () => {
  browserSync.init({
    server: './dist',
  });

  // Monitora as alterações no json
  gulp.watch(
    `themes/${arg.theme}/source/**/*.json`,
    gulp.series(['clean:css', 'sass', 'clean:html', 'html'])
  );

  // Monitora as alterações no scss
  gulp.watch(
    `themes/${arg.theme}/assets/css/**/*.scss`,
    gulp.series(['clean:css', 'sass', 'clean:html', 'html'])
  );

  // Monitora as alteração nas pastas 'blocks', 'layout', 'pages', 'partials'
  gulp.watch(`themes/${arg.theme}/**/**.htm`, gulp.series(['clean:html', 'html']));

  // Faz a sincronização caso haja qualquer modificação no projeto
  gulp.watch(`themes/${arg.theme}/**/**.*`).on('change', browserSync.reload);
});

// Task de remoção das imagens da pasta '/dist'
gulp.task(
  'clean:src',
  gulp.series(() => {
    return del(['./dist/src/images/**.*']);
  })
);

// Task de remoção do html
gulp.task('clean:html', () => {
  return del(['./dist/*.html']);
});

// Task de remoção do css
gulp.task('clean:css', () => {
  return del([`themes/${arg.theme}/assets/css/*.css`]);
});

// Task default do gulp, ela é chamada sempre que o comando 'gulp' é executado
gulp.task(
  'default',
  gulp.series(['clean:css', 'clean:html', 'sass', 'html', 'src', 'serve'])
);

// fetch command line arguments
const arg = (argList => {

  let arg = {}, a, opt, thisOpt, curOpt;
  for (a = 0; a < argList.length; a++) {

    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, '');

    if (opt === thisOpt) {
      // argument value
      if (curOpt)
        arg[curOpt] = opt;
      curOpt = null;
    } else {
      // argument name
      curOpt = opt;
      arg[curOpt] = true;

    }

  }

  return arg;

})(process.argv);
