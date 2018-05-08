var debug = require('debug')('app:storageprovider:log');
var loopback = require('loopback');

var uuid = require('uuid');
var _ = require('underscore');

var storageProvider = {};

module.exports = storageProvider;

storageProvider.upload = function (ctx, cb) {

  containermodel = loopback.getModel('container');
  allowedImageContent = ['image/jpg', 'image/png', 'image/jpeg'];
  // allowedVideoContent = ['video/mpg', 'video/mpeg', 'video/quicktime'];

  var bucketsettings = containermodel.app.models.container.getDataSource();
  var photocontainerSplit = bucketsettings.settings["profile-photos"].split('/');
  console.log("photocontainerSplit: ",photocontainerSplit);
  // var videocontainerSplit = bucketsettings.settings["msgr-videos"].split('/');

  var msgrphotobucket = photocontainerSplit[0];
  var msgrphotodirectory = (photocontainerSplit.length == 2) ? photocontainerSplit[1] : null;
  // var msgrvideobucket = videocontainerSplit[0];
  // var msgrvideodirectory = (videocontainerSplit.length == 2) ? videocontainerSplit[1] : null;

  function getContainer(contenttype) {

    var containerValue = msgrphotobucket;
    // if (isVideo(contenttype)) {
    //   containerValue = msgrvideobucket;
    // }
    return containerValue;
  }

  function getAllowedContentTypes(contenttype) {
    var allowedContentTypes = allowedImageContent;
    // if (isVideo(contenttype)) {
    //   allowedContentTypes = allowedVideoContent;
    // }

    return allowedContentTypes;
  }

  function getDirectory(contenttype) {

    var directory = msgrphotodirectory;
    // if (isVideo(contenttype)) {
    //   directory = msgrvideodirectory;
    // }

    directory = (directory === null) ? "" : directory + "/";
    return directory;
  }

  function isPhoto(contenttype) {
    if (_.contains(allowedImageContent, contenttype)) return true; else return false;
  }

  // function isVideo(contenttype) {
  //   if (_.contains(allowedVideoContent, contenttype)) return true; else return false;
  // }

  function getContentType() {
    return ctx.args.contenttype;
  }

  var options = {
    container: getContainer(getContentType()),
    allowedContentTypes: getAllowedContentTypes(getContentType()),
    getFilename: function (fileInfo, req, res) {
      var origFilename = fileInfo.name;
      // optimistically get the extension
      var parts = origFilename.split('.'),
        ext = parts[parts.length - 1];
      // set generated strong random key based on time for filename

      return getDirectory(getContentType()) + uuid.v1() + "." + ext;
    }
  };

  containermodel.upload(ctx.req, ctx.res, options, function (err, storageResponse) {
    if (err) return cb(err);
    storageResponse = JSON.stringify(storageResponse);
    console.log(err + " " + storageResponse);
    cb(err, "Success");

  });

};
