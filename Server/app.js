var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const walletRouter = require('./routes/walletRouter');
const websocketServices = require('./services/websocketService');
var comicRouter = require('./routes/comicRoutes');
const nftRoutes = require('./routes/nftRounter');

const adminRoutes = require('./routes/adminRounter');
var AuthRounter = require("./routes/Auth_Rounters");
//session
var session = require('express-session')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Để xử lý các yêu cầu POST với JSON
app.use(bodyParser.urlencoded({ extended: true })); // Để xử lý các form-urlencoded


//session check
app.use(session({
  secret: 'AAAAAAAAABBBBBBBBBCCCCCCCDDDDDDD',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))



app.use('/index', indexRouter);
app.use('/users', usersRouter);


app.use('/wallet', walletRouter);
app.use('/comics', comicRouter);
app.use('/nft', nftRoutes);
app.use('/admin', adminRoutes);
app.use("/auth", AuthRounter);


websocketServices;


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

 // link api sẽ có tiền tố /api ở đầu
 if(req.originalUrl.indexOf('/api') == 0) { // nếu = 0 thì có api
  res.json(
    {
      status : err.status,
      msg:  err.message
    }
    
  )
}
else {
  res.render('error');
    }
  res.render('error');
});

module.exports = app;

const PORT = process.env.PORT || 3001; 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
