//Only used for android cordova
if(cordova != undefined){
  var permissions = cordova.plugins.permissions
} else {
  var permissions = null
}


export const getCamera = function(callback, error) {

  const permissionList = [permissions.CAMERA, permissions.WRITE_EXTERNAL_STORAGE, permissions.READ_EXTERNAL_STORAGE]

  const hasCameraPermission = permissions.checkPermission(permissions.CAMERA)
  const hasExternalStorageWritePermission = permissions.checkPermission(permissions.WRITE_EXTERNAL_STORAGE)
  const hasExternalStorageReadPermission = permissions.checkPermission(permissions.READ_EXTERNAL_STORAGE)

  if(hasCameraPermission && hasExternalStorageWritePermission && hasExternalStorageReadPermission){
    callback
  } else {

    permissions.requestPermissions(
      permissionList,
      callback,
      error
    )
  }

}

export const getGeolocation = function(callback, error) {

  const hasPermission = permissions.checkPermission(permissions.ACCESS_FINE_LOCATION)

  if(hasPermission){
    window.navigator.geolocation.getCurrentPosition(callback)
  } else {
    permissions.requestPermission(
      permissions.ACCESS_FINE_LOCATION,
      function(){
        window.navigator.geolocation.getCurrentPosition(callback)
      },
      () => { error() }
    )
  }

}

export const cordovaFacebookLogin = function(permissions, onSuccess, onFailure){
  facebookConnectPlugin.login(permissions, onSuccess, onFailure)
}

export const cordovaGoogleLogin = function(onSuccess, onFailure){
  window.plugins.googleplus.login(
    {
      'webClientId': '1054707215391-kpl49vuhak0mpma4cdqesa39tntgs0rb.apps.googleusercontent.com',
    },
    (obj) => {
      onSuccess(obj)
    },
    (error) => {
      onFailure(error)
    }
  )
}

export const socialLogOut = function(onSuccess, onFailure){

  facebookConnectPlugin.logout()
  window.plugins.googleplus.logout()
  window.plugins.googleplus.disconnect()
  onSuccess()

}

export const facebookLogout = function(onSuccess, onFailure){
  facebookConnectPlugin.logout(
    onSuccess,
    onFailure
  )
}

export const googleLogout = function(onSuccess, onFailure){
  window.plugins.googleplus.logout(
    onSuccess,
    onFailure
  )
  window.plugins.googleplus.disconnect()
}

export const googleSilent = function(onSuccess, onFailure){
  window.plugins.googleplus.trySilentLogin(
    {
      'webClientId': '1054707215391-kpl49vuhak0mpma4cdqesa39tntgs0rb.apps.googleusercontent.com',
    },
    onSuccess,
    onFailure
  )
}
