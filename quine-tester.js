db = db.getSiblingDB("quine");
db.dropDatabase();
db.quine.insert({});

if (typeof(filename) == "undefined") {
	filename = "mongoquine.json";
}

cmd = JSON.parse(cat(filename));

res = db.runCommand(cmd);
if ( ! res.ok) {
    shellPrint(res);
} else {
    output = res.cursor.firstBatch[0];
    printjson(cmd);

    if (bsonWoCompare(cmd, output) == 0) {
        print("OVERALL: SAME!");
    } else {
        print("OVERALL: DIFFERENT!");
        printjson(output);

		if ("pipeline" in output) {
			for (var i in cmd.pipeline) {
				print("pipeline["+i+"]: " + ((i in output.pipeline && bsonWoCompare(cmd.pipeline[i], output.pipeline[i]) == 0) ? "SAME" : "DIFFERENT") + "!");
			}
		}
    }
}
