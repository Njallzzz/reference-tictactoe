module.exports = (function() {
    require('server/globals');

    var port = process.env.PORT || 8080;
    var env = process.env.NODE_ENV || 'development';

	var pguser = process.env.PGUSER || 'postgres';
	var pgpassword = process.env.PGPASSWORD || 'mysecretpassword';
	var pgdatabase = process.env.PGDATABASE || 'postgres';
	var pgport = process.env.PGPORT || 5432;
	var pghost = process.env.PGHOST || 'localhost';

    var server = require('./server/server.js')(inject({
        port,
        env,
		pguser,
		pgpassword,
		pgdatabase,
		pgport,
		pghost
    }));

    server.startServer(function() {
        console.log('Server listening on port ' + port);
    });

})();
