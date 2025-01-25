// For the latest Axiom VirtualNetwork+ scripting documentation, 
// please visit: http://www.zachtronics.com/virtualnetwork/

function getTitle() {
    return "EASY MODE #46";
}

function getSubtitle() {
    return "x10x10x MITSUZEN D300-N";
}

function getDescription() {
    return "[EASY: there are no unreliable links.]\nThe data on this drive array is duplicated across three drives for redundancy, with a file name index stored in the *controller* (file 200). Unfortunately, the drive array is failing.\nFor each file stored in the drive array, create a file in your host that contains the file name and data. Some values are corrupted and will read as a keyword (‗FAIL‗) instead of a number. You will need to read these values from a different drive that is not corrupted.";
}

function genRandomTargetFile(columns)
{
	var lineCount = randomInt(5, 8);
	var contentNumbersCount = lineCount * columns;
	var result = [];
	
	for (let i = 0; i < contentNumbersCount; i++) 
	{
		result.push(randomInt(1000, 9999));
	}
	
	return result;
}

function genThreeFailFilesContent(cleanFileContent)
{
	var result = [];
	var failKeyword = "FAIL";
	
	result.push(cleanFileContent.slice());
	result.push(cleanFileContent.slice());
	result.push(cleanFileContent.slice());
	
	for (let i = 0; i < cleanFileContent.length; i++)
	{
		for (let j = 0; j < randomInt(0, 2); j++)
		{
			result[randomInt(0, 2)][i] = failKeyword;
		}
	}
	
	
	return result;
}

function initializeTestRun(testRun) {
	var controllerHost = createHost("CONTROLLER", 5, -3, 1, 10);
	
	var driveHost1 = createHost("DRIVE-1", 8, 4, 7, 1);
	var driveHost2 = createHost("DRIVE-2", 8, 1, 7, 1);
	var driveHost3 = createHost("DRIVE-3", 8, -2, 7, 1);
	

	var linkC_D1 = createLink(controllerHost, 801, driveHost1, -1);
	var linkC_D2 = createLink(controllerHost, 802, driveHost2, -1);
	var linkC_D3 = createLink(controllerHost, 803, driveHost3, -1);
	
	var animeNames = [
	"HALF BODY CHEMIST",
	"FIGHT/LEAVE DAY",
	"KISS X BROS",
	"SWORN ART OFFLINE",
	"TWO PIECES",
	"LIFE NOTE",
	];
	
	var driveAnimeColumns = 6;
	var filesCount = 6;
	
	var driveFilesList = [];
	var targetFilesContent = [];
	var driveFilesContent = [];
	
	for (let i = 0; i < filesCount; i++) {
		var driveAnimeId = 201 + i + randomInt(0, 9) * 10;
		var driveAnimeName = animeNames[randomInt(0, animeNames.length-1)];
		var targetFileContent = genRandomTargetFile(driveAnimeColumns);
		animeNames.splice(animeNames.indexOf(driveAnimeName), 1);
		
		driveFilesList.push(driveAnimeId);
		driveFilesList.push(driveAnimeName);
		
		driveFilesContent.push(genThreeFailFilesContent(targetFileContent));
		
		targetFileContent.splice(0, 0, driveAnimeName);
		targetFilesContent.push(targetFileContent);
		requireCreateFile(getPlayerHost(), targetFilesContent[i], "");
	}
	
	//var masterFile = createNormalFile(getPlayerHost(), 200, FILE_ICON_DATA, filesList);
	var masterFile = createNormalFile(controllerHost, 200, FILE_ICON_DATA, driveFilesList);
	setFileColumnCount(masterFile, 2);
	
	mergeRequirements(filesCount, "Create the specified files in your host.");
	
	for (let i = 0, j = 0; i < filesCount; i++, j+=2) {	
				
		var driveAnimeFile1 = createLockedFile(driveHost1, driveFilesList[j], FILE_ICON_MOVIE, driveFilesContent[i][0]);
		setFileColumnCount(driveAnimeFile1, driveAnimeColumns);
		
		var driveAnimeFile2 = createLockedFile(driveHost2, driveFilesList[j], FILE_ICON_MOVIE, driveFilesContent[i][1]);
		setFileColumnCount(driveAnimeFile2, driveAnimeColumns);
		
		var driveAnimeFile3 = createLockedFile(driveHost3, driveFilesList[j], FILE_ICON_MOVIE, driveFilesContent[i][2]);
		setFileColumnCount(driveAnimeFile3, driveAnimeColumns);
		
		if (i > 0) {
			setFileInitiallyCollapsed(driveAnimeFile1);
			setFileInitiallyCollapsed(driveAnimeFile2);
			setFileInitiallyCollapsed(driveAnimeFile3);
		}
	}
}

function onCycleFinished() {
}
