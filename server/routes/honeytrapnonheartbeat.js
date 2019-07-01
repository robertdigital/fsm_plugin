/*
// Simple Query to Find Non-Heartbeat Events That Happened in the last 90 days
*/

import elasticsearch from 'elasticsearch'

export default function (server) {

	//JSON object defined
	const client = new elasticsearch.Client({
		  host: 'localhost:9200',
		  log: 'trace'
		});

	//this is a JSON object being sent to server.route
	server.route({
		// brackets { } mean it will be automatically parsed as a variable
		// this is the relative web address which will be contacted to run this query
		path: '/api/fsm_plugin/honeytrapnonheartbeat',
		method: 'GET',
		//this is async, so we use await to wait until a value is returned
		//you are defining nested functions
		handler : async function (req, h) {
			const query =  req.params.searchterm;
			var hits = 0;
			var body = null;
			await client.search({
				_source: ["date", "source-ip", "source-port", "destination-ip", "destination-port", "category", "type"],
				index: 'honeytrap',
				size: 100,
				body: {
					  "query": {
						"bool": {
						  "must_not": [
							{
							  "match": {
								"category": "heartbeat"
							  }
							}
						  ],
						  "filter": [
							{
							  "range": {
								"date": {
								  "gte": "now-90d/d"
								}
							  }
							}
						  ]
						}
					  }
				}
			}).then(function (body) {
				hits = body.hits.hits;
				body = body;
				//console.log(hits);
			}, function (error) {
				//send an error message to the console log so we know something went wrong
				console.trace(error.message);
			});

			//returns a JSON object, defined as dictionary
			return {
				response: hits,
				body : body
			};
		}

	});

}

