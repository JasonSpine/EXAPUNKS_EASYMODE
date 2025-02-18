// For the latest Axiom VirtualNetwork+ scripting documentation, 
// please visit: http://www.zachtronics.com/virtualnetwork/

function getTitle() {
    return "VIRUS CAMPAIGN #2";
}

function getSubtitle() {
    return "Antivirus needed!";
}

function getDescription() {
    return "Previous attack worked so good that SOME files on your computer got infected too! Remove infection from all INFECTED files in your computer. [file 100] contains infection pattern.";
}

function addVirSignatureToArray(vir, a)
{
	var index = randomInt(0, a.length);
	
	var b = a.concat(vir);
	
	/*
	printConsole(index);
	printConsole(a);
	printConsole(b);
	*/
	return b;
}

function genRandomRamArray()
{
	var arrLen = randomInt(4, 8) * 4;
	var a = [];
	
	for (let i = 0; i < arrLen; i++) {
		a[i] = randomInt(10, 99);
	}
	
	return a;
}

function initializeTestRun(testRun) {
    var targetHost1 = createHost("my-pc", 5, -1, 6, 6);
    
    var virSignatureText = convertTextToKeywords("CIH 1049 CIH v 1 4 US");
    var fakeVirSignatureText = convertTextToKeywords("CIH 1049 IS DANGER OUS 4 US");
    
    var masterFile = createNormalFile(getPlayerHost(), 100, FILE_ICON_DATA, virSignatureText);
    
    // generate PC files
    
    var filesList1 = [];
    var virFilesCount = 0;
	
	for (let i = 0; i < randomInt(5, 10); i++) {
		var fileID = 201 + i + randomInt(0, 9) * 10;
		filesList1.push(fileID);
		
		if (randomInt(1, 2) === 1) {
			var fileContent = convertTextToKeywords(randomName() + " " + randomAddress());
			var fileIcon = FILE_ICON_ARCHIVE;
		}
		else {
			var fileContent = genRandomRamArray();
			var fileIcon = FILE_ICON_DATA;
		}
		
		var r = randomInt(1, 10);
	
		if (r <= 6)
		{
			// vir
			var hostFile = createNormalFile(targetHost1, fileID, fileIcon, addVirSignatureToArray(virSignatureText, fileContent));
			
			if (virFilesCount > 0)
				setFileInitiallyCollapsed(hostFile);
			virFilesCount++;
			
			requireChangeFile(hostFile, fileContent, "Remove the virus from your PC.");
		}
		else if (r <= 8)
		{
			// fake vir
			var hostFile = createNormalFile(targetHost1, fileID, fileIcon, addVirSignatureToArray(fakeVirSignatureText, fileContent));
		}
		else if (r <= 10)
		{
			// no vir
			var hostFile = createNormalFile(targetHost1, fileID, fileIcon, fileContent);
		}
		
	}
	
	var lockedFile1 = createLockedFile(targetHost1, 200, FILE_ICON_FOLDER, filesList1);
	//setFileColumnCount(lockedFile1, 1);
	
	if (virFilesCount > 1) {
		mergeRequirements(virFilesCount, "Remove the virus from your PC.");
	}
}

function onCycleFinished() {
}
