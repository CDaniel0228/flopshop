const { auth } = require("../firebase");
const { Router } = require("express");
const router = Router();
const alert = require('alert')
const {signInWithEmailAndPassword,signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, createUserWithEmailAndPassword,signInWithCredential} = require("firebase/auth");
const bodyParser = require('body-parser');
const { check, validationResult } = require("express-validator");
const Multer = require('multer');
const { getDatabase, ref, set, push, child } =require("firebase/database");

var jsonParser = bodyParser.json()

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },

});

router.get('/', function (req, res) {
  res.redirect('/index');
});

router.get('/index', function (req, res) {
  res.render('index')
})

router.get('/sobre', function (req, res) {
  res.render('about')
})

router.get('/tienda', function (req, res) {
  res.render('shop')
})

router.get('/shop-single', function (req, res) {
  res.render('shop-single')
})

router.post('/shop-single', function (req, res) {
  res.redirect('/login')
})

router.get('/contacto', function (req, res) {
  res.render('contact');
});
var usuario=[];
router.get('/formulario', function (req, res) {
  var datos=[]
  datos=usuario;
  res.render('formulario',{datos});
});


router.get('/login', function (req, res) {
  res.render('login')
});
const db = getDatabase();
router.post('/formulario', async function (req, res) {
  const box = req.body
  const key = push(child(ref(db), 'tienda/compra/')).key;

  set(ref(db, 'tienda/compra/' +key), {
    nombre: box.name,
    banco: box.email,
    articulo : box.subject,
    precio: box.message
  });

  res.redirect('/tienda');
});

router.post('/gom',jsonParser, async function (req, res) {
  const idToken = req.body.id_token;
  const credential = GoogleAuthProvider.credential(idToken);

// Sign in with credential from the Google user.
signInWithCredential(auth, credential).then((result) => {
  // Signed in 
  usuario=result.user;

  console.log(result.user.email);
}).catch((error) => {
  // Handle Errors here.
  const errorCode = error.code;
  const errorMessage = error.message;
  // The email of the user's account used.
  const email = error.customData.email;
  // The AuthCredential type that was used.
  const credential = GoogleAuthProvider.credentialFromError(error);
  // ...
});
  res.redirect('/formulario')
});

router.post('/facebook',jsonParser, async function (req, res) {
  const idToken = req.body.id_token;
  const credential = FacebookAuthProvider.credential(idToken);

  signInWithCredential(auth, credential)
  .then((result) => {
    // Signed in 
    usuario=result.user;
    console.log(usuario.email);
    const credential = FacebookAuthProvider.credentialFromResult(result);
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);
    // ...
  });
  res.redirect('/formulario')
});

router.post('/login',[check("email").isEmail().withMessage("invalid email address").normalizeEmail(),
check("password").isLength({min: 7, max: 15}).withMessage("minimo 7").trim(),],
  async function (req, res) {
  const errors = validationResult(req)
  const action = req.body.action;
  const provider = new GoogleAuthProvider();
  
 if (action === 'facebook') {
    res.redirect('/index');
} else if (action === 'google') {
  
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

  
}else if (action === 'correo') {
  if (!errors.isEmpty()) {
    alert(errors.array());
  }else{
  const box = req.body
  try {
    const userCredentials = await signInWithEmailAndPassword(auth, box.email, box.password)
    if (userCredentials) {
      usuario=userCredentials.user;
      res.redirect('/home');
    }
  } catch (error) {
    console.log(error);
  }
}
}
});

router.post('/registro', function (req, res) {
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
});


module.exports = router;