// For the latest Axiom VirtualNetwork+ scripting documentation, 
// please visit: http://www.zachtronics.com/virtualnetwork/

function getTitle() {
    return "VIRUS CAMPAIGN #1";
}

function getSubtitle() {
    return "Virus infection";
}

function getDescription() {
    return "You know how viruses work... Append virus [file 100] contents to each file in the network.\nWe don't want to break the filesystem, so don't infect directory listings [file 200]";
}

function initializeTestRun(testRun) {
	var fillText = convertTextToKeywords("CIH 1049 CIH v 1 4 US");
	//var fillText = [1]; // test
	
	var targetHost1 = createHost("ADMIN", 5, -1, 3, 5);
	
	
	var targetHost2 = createHost("victim-1", 10, -3, 4, 3);

	var link1_2 = createLink(targetHost1, 801, targetHost2, -1);

	var targetHost3 = createHost("victim-2", 10, 3, 4, 3);

	var link1_3 = createLink(targetHost1, 802, targetHost3, -1);

	var masterFile = createNormalFile(getPlayerHost(), 100, FILE_ICON_DATA, fillText);
	
	var filesList2 = [];
	
	for (i = 0; i < randomInt(0, 10); i++) {
		var fileID = 201 + i + randomInt(0, 9) * 10;
		filesList2.push(fileID);
		
		var fileContent = convertTextToKeywords(randomName() + " " + randomAddress());
		
		var hostFile = createNormalFile(targetHost2, fileID, FILE_ICON_ARCHIVE, fileContent);
		setFileInitiallyCollapsed(hostFile);
		
		requireChangeFile(hostFile, fileContent.concat(fillText), "Infect VICTIM-1 files.");
	}
	
	var lockedFile2 = createLockedFile(targetHost2, 200, FILE_ICON_FOLDER, filesList2);
	//setFileColumnCount(lockedFile2, 1);
	
	if (filesList2.length > 1) {
		mergeRequirements(filesList2.length, "Infect VICTIM-1 files.");
	}
	
	var filesList3 = [];
	
	for (i = 0; i < randomInt(0, 10); i++) {
		var fileID = 301 + i + randomInt(0, 9) * 10;
		filesList3.push(fileID);
		
		var fileContent = convertTextToKeywords(randomName() + " " + randomAddress());
		
		var hostFile = createNormalFile(targetHost3, fileID, FILE_ICON_ARCHIVE, fileContent);
		setFileInitiallyCollapsed(hostFile);
		
		requireChangeFile(hostFile, fileContent.concat(fillText), "Infect VICTIM-2 files.");
	}
	
	var lockedFile3 = createLockedFile(targetHost3, 200, FILE_ICON_FOLDER, filesList3);
	//setFileColumnCount(lockedFile3, 1);
	
	if (filesList3.length > 1) {
		mergeRequirements(filesList3.length, "Infect VICTIM-2 files.");
	}
}

function onCycleFinished() {
}
