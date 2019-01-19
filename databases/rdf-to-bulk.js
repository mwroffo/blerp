'use strict';

const dir = require('node-dir');
const parseRDF = require('./lib/parse-rdf.js');
const dirname = process.argv[2];

const options = {
    // regular exp defines search filter:
    match: /\.rdf$/,
    exclude: ['pg0.rdf']
};

dir.readFiles(dirname, options, (err,content,next) => {
    if (err) throw err;
    const doc = parseRDF(content);
    console.log(JSON.stringify({index: {_id: `pg${doc.id}`} }));
    console.log(JSON.stringify(doc));
    // capturing this output should give us our Elasticsearch-LDJ
    next();
});