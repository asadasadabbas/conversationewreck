
errorObj = new Error();
var storageProvider = require('../utils/storageProvider');

module.exports = function (Person) {

	Person.postFiles = function (contenttype, ctx, cb) {
	    var errorObj;

		storageProvider.upload(ctx, function (err, response) {
	    	if (err) {
	    		cb(err, null);
	    	} else{
	    		cb(null, response);
	    	}	    	
	    });
	};

 	Person.remoteMethod('postFiles', {
	    description: 'Post a file',
	    accepts: [
	      {arg: 'contenttype', type: 'String', description: 'eg. image/png', required: true, http: {source: 'query'}},
      	  {arg: 'ctx', type: 'object', http: {source: 'context'}}
	    ],
	    returns: {arg: 'success', root: true},
	    http: {verb: 'POST', path: '/postFiles'}
  	});
};
