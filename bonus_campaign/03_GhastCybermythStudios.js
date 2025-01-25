// For the latest Axiom VirtualNetwork+ scripting documentation, 
// please visit: http://www.zachtronics.com/virtualnetwork/

// from author: I know this code is really bad...

function getTitle() {
    return "EXAPUNKS EASY MODE";
}

function getSubtitle() {
    return "GHAST CYBERMYTH STUDIOS";
}

function getDescription() {
    return "[EASY: owed sum and paid sum won't exceed 9999.] Each host contains two files: a list of accounts and a list of transactions. Although the entries in these files vary, the first value of each entry is a unique identifier that connects an account to one or more transactions.\nDetermine the amount of back-pay owed to Ghast and Moss by subtracting the amount that they were paid (file 221) from the amount that they were owed (file 231). Then add their shell company (file 300) to the list of accounts payable (file 220) and issue a single payment to it for the total amount owed (file 221).\nNote that all monetary amounts are represented as two values: dollars, then cents.";
}

function leadingZeros(x)
{
	if (x < 10) {
		return "0" + x.toString();
	}
	
	return x.toString();
}

function genRandomDate()
{
	//"02-12-92" to "03-15-92"
	return leadingZeros(randomInt(2,3)) + "-" + leadingZeros(randomInt(1, 15)) + "-" + "92";
}

function genRandomDatesArray(itemsCount)
{
	result = [];
	for (let i = 0; i < itemsCount; i++)
	{
		result.push(genRandomDate());
	}
	
	result.sort();
	
	return result;
}

function initializeTestRun(testRun) {
    var gatewayHost = createHost("gateway", 5, 1, 13, 1);
    var receivableHost = createHost("receivable", 6, -4, 1, 3);
    var payableHost = createHost("payable", 8, -4, 1, 3);
    var payrollHost = createHost("payroll", 11, -4, 1, 3);
    var recordsHost = createHost("records", 13, -4, 1, 3);
    var clockHost = createHost("clock", 16, -4, 1, 3);
    
    var linkReceivable = createLink(gatewayHost, 800, receivableHost, -1);
    var linkPayable = createLink(gatewayHost, 801, payableHost, -1);
    var linkPayroll = createLink(gatewayHost, 802, payrollHost, -1);
    var linkRecords = createLink(gatewayHost, 803, recordsHost, -1);
    var linkClock = createLink(gatewayHost, 804, clockHost, -1);
    
    var dateRegister = createRegister(clockHost, 16, -4, "DATE");
	var dateRegisterValue = "04-26-92";
	setRegisterReadCallback(dateRegister, function() {
		return dateRegisterValue;
	});
	
	var timeRegister = createRegister(clockHost, 16, -3, "TIME");
	var timeRegisterValue = "10:52 PM";
	setRegisterReadCallback(timeRegister, function() {
		return timeRegisterValue;
	});
	
	var masterFileContents = ["GHAST", "MOSS", "TRASH WORLD CLEANING"];
	
	// FILL RECEIVEABLE HOST FILES
	
	var receivableAccountsFileContents = [];
	var receivableDataFileContents = [];
	
	var receivableAccountsNames = ["PIPE CORPORATION", "KEEMA STUDIOS", "RADOTOYS", "GOOSE MOUNTAIN DISTRIBUTORS", "UNTITLED PUBLISHER"];
	var receivableAccountsCount = randomInt(3, 5);
	
	for (let i = 0; i < receivableAccountsCount; i++) {
		var accountName = receivableAccountsNames[randomInt(0, receivableAccountsNames.length-1)];
		receivableAccountsNames.splice(receivableAccountsNames.indexOf(accountName), 1);
		receivableAccountsFileContents.push(1000 + i);
		receivableAccountsFileContents.push(accountName);
	}
	
	var receivableDataCount = randomInt(4, 8);
	
	receivableDataDates = genRandomDatesArray(receivableDataCount);
	
	for (let i = 0; i < receivableDataCount; i++) {
		receivableDataFileContents.push(1000 + randomInt(0, receivableAccountsCount - 1));
		receivableDataFileContents.push(receivableDataDates[i]);
		receivableDataFileContents.push(randomInt(500, 8500));
		receivableDataFileContents.push(randomInt(0, 99));
	}
	
	// FILL RECORDS HOST FILES
	
	var recordsAccountsFileContents = [];
	var recordsDataFileContents = [];
	
	var payrollAccountsFileContents = [];
	
	
	var recordsAndPayrollAccountsNames = [masterFileContents[0], masterFileContents[1], "CRYPTIC", "HANK", "NIGHTSHADE"];
	var recordsAndPayrollAccountsCount = recordsAndPayrollAccountsNames.length;
	
	var GHAST_RP_ID = -1;
	var MOSS_RP_ID = -1;
	
	var payableAccountsNames = [];
	
	for (let i = 0; i < recordsAndPayrollAccountsCount; i++) {
		var accountName = recordsAndPayrollAccountsNames[randomInt(0, recordsAndPayrollAccountsNames.length-1)];
		recordsAndPayrollAccountsNames.splice(recordsAndPayrollAccountsNames.indexOf(accountName), 1);
		
		recordsAccountsFileContents.push(4000 + i);
		recordsAccountsFileContents.push(accountName);
		
		payrollAccountsFileContents.push(3000 + i);
		payrollAccountsFileContents.push(accountName);
		
		payableAccountsNames.push(accountName);
		
		if (accountName === masterFileContents[0])
		{
			GHAST_RP_ID = i; // RP = records, payroll
		}
		
		if (accountName === masterFileContents[1])
		{
			MOSS_RP_ID = i;
		}
	}
	
	var recordsNames = ["INTOXICATION", "ABSENTEEISM", "INSUBORDINATION"]
	recordsDates = genRandomDatesArray(2);
	
	if (randomInt(0, 1) == 0)
	{
		recordsDataFileContents.push(4000 + GHAST_RP_ID);
		recordsDataFileContents.push(recordsDates[0]);
		recordsDataFileContents.push(recordsNames[randomInt(0, recordsNames.length - 1)]);
		
		recordsDataFileContents.push(4000 + MOSS_RP_ID);
		recordsDataFileContents.push(recordsDates[1]);
		recordsDataFileContents.push(recordsNames[randomInt(0, recordsNames.length - 1)]);
	}
	else
	{
		recordsDataFileContents.push(4000 + MOSS_RP_ID);
		recordsDataFileContents.push(recordsDates[0]);
		recordsDataFileContents.push(recordsNames[randomInt(0, recordsNames.length - 1)]);
		
		recordsDataFileContents.push(4000 + GHAST_RP_ID);
		recordsDataFileContents.push(recordsDates[1]);
		recordsDataFileContents.push(recordsNames[randomInt(0, recordsNames.length - 1)]);
	}
	
	// FILL PAYABLE HOST FILES
	
	var payableAccountsFileContents = [];
	
	var payableExtraAccountNames = ["REED OFFICE SUPPLY", "TEC ENTERTAINMENT", "GROSS & SADLER LLP"];
	var payableExtraAccountNamesCount = randomInt(1, payableExtraAccountNames.length);
	
	// insert extra names in random indexes
	for (let i = 0; i < payableExtraAccountNamesCount; i++) {
		var accountName = payableExtraAccountNames[randomInt(0, payableExtraAccountNames.length-1)];
		payableExtraAccountNames.splice(payableExtraAccountNames.indexOf(accountName), 1);
		payableAccountsNames.splice(randomInt(0, payableAccountsNames.length - 1), 0, accountName);
	}
	
	var GHAST_P_ID = -1;
	var MOSS_P_ID = -1;
	
	for (let i = 0; i < payableAccountsNames.length; i++) {
		var accountName = payableAccountsNames[i];
		payableAccountsFileContents.push(2000 + i);
		payableAccountsFileContents.push(accountName);
		
		if (accountName === masterFileContents[0])
		{
			GHAST_P_ID = i; // P = payable
		}
		
		if (accountName === masterFileContents[1])
		{
			MOSS_P_ID = i;
		}
	}
	
	var payableDataFileContents = [];
	var payableDataCount = randomInt(5, 15);
	
	payableDataDates = genRandomDatesArray(payableDataCount);
	
	var GM_paid_count = 0;
	
	for (let i = 0; i < payableDataCount; i++) {
		payableDataFileContents.push(2000 + randomInt(0, payableAccountsNames.length - 1));
		payableDataFileContents.push(payableDataDates[i]);
		payableDataFileContents.push(randomInt(1000, 4000));
		payableDataFileContents.push(randomInt(0, 99));
		
		if (payableDataFileContents[i * 4] == (GHAST_P_ID + 2000) || (payableDataFileContents[i * 4] == (MOSS_P_ID + 2000)))
		{
			GM_paid_count += 1;
		}
	}
	
	// FILL PAYROLL HOST FILES
	
	var payrollDataFileContents = [];
	var payrollDataCount = randomInt(5, 15);
	
	payrollDataDates = genRandomDatesArray(payrollDataCount);
	
	var ghastPayrollRandIdx = randomInt(0, payrollDataCount) - 1;
	var mossPayrollRandIdx = randomInt(0, payrollDataCount) - 1;
	
	for (let i = 0; i < payrollDataCount; i++) {
		// add owed records to payroll for GHAST or MOSS or both, to make sure there always will be at least one
		// their value will be recalculated later
		if (i === ghastPayrollRandIdx) {
			payrollDataFileContents.push(3000 + GHAST_RP_ID);
		}
		else if (i === mossPayrollRandIdx) {
			payrollDataFileContents.push(3000 + MOSS_RP_ID);
		}
		else {
			payrollDataFileContents.push(3000 + randomInt(0, recordsAndPayrollAccountsCount) - 1);
		}
		
		payrollDataFileContents.push(payrollDataDates[i]);
		payrollDataFileContents.push(randomInt(1000, 4000));
		payrollDataFileContents.push(randomInt(0, 99));
	}
	
	// Recalc GHAST and MOSS cash so they are always owed postivie value after substract
	var owedSum = randomInt(4800, 6500);
	var paidSum = randomInt(500, 2500);
	
	var GM_owed_count = 0;
	
	for (let i = 0; i < payrollDataFileContents.length; i+=4)
	{ // 231 owed
		if ((payrollDataFileContents[i] == (GHAST_RP_ID + 3000)) || (payrollDataFileContents[i] == (MOSS_RP_ID + 3000)))
		{
			GM_owed_count += 1;
		}
	}
	
	var recordsDivider = 20;
	var oweRecords = [];
	var payRecords = [];
	var oweRecordIdx = 0;
	var payRecordIdx = 0;
	
	for (let i = 0; i < GM_owed_count; i++)
	{ // 231 owed
		oweRecords.push(Math.floor(recordsDivider/GM_owed_count));
	}

	for (let i = 0; i < GM_paid_count; i++)
	{ // 221 paid
		payRecords.push(Math.floor(recordsDivider/GM_paid_count));
	}
	
	// Randomize oweRecords and pay records by transfering value of 1 between array items for a moment
	if (oweRecords.length > 0)
	{
		for (let i = 0; i < 100; i++)
		{
			var randomItemIdx1 = randomInt(0, oweRecords.length) - 1;
			var randomItemIdx2 = randomInt(0, oweRecords.length) - 1;
			
			if (randomItemIdx1 === randomItemIdx2) {
				continue;
			}
			
			if (oweRecords[randomItemIdx1] < 2) {
				continue;
			}
			
			oweRecords[randomItemIdx1] -= 1;
			oweRecords[randomItemIdx2] += 1;
		}
	}
	
	if (payRecords.length > 0)
	{
		for (let i = 0; i < 100; i++)
		{
			var randomItemIdx1 = randomInt(0, payRecords.length) - 1;
			var randomItemIdx2 = randomInt(0, payRecords.length) - 1;
			
			if (randomItemIdx1 === randomItemIdx2) {
				continue;
			}
			
			if (payRecords[randomItemIdx1] < 2) {
				continue;
			}
			
			payRecords[randomItemIdx1] -= 1;
			payRecords[randomItemIdx2] += 1;
		}
	}
	
	// Divide sum between owed and paid recrords!
	
	for (let i = 0; i < payrollDataFileContents.length; i+=4)
	{ // 231 owed
		if ((payrollDataFileContents[i] == (GHAST_RP_ID + 3000)) || (payrollDataFileContents[i] == (MOSS_RP_ID + 3000)))
		{
			payrollDataFileContents[i+2] = Math.floor(owedSum * (oweRecords[oweRecordIdx]/recordsDivider));
			
			oweRecordIdx += 1;
		}
	}

	for (let i = 0; i < payableDataFileContents.length; i+=4)
	{ // 221 paid
		if ((payableDataFileContents[i] == (GHAST_P_ID + 2000)) || (payableDataFileContents[i] == (MOSS_P_ID + 2000)))
		{
			payableDataFileContents[i+2] = Math.floor(paidSum * (payRecords[payRecordIdx]/recordsDivider));
			
			payRecordIdx += 1;
		}
	}
	
	var masterFile = createNormalFile(getPlayerHost(), 300, FILE_ICON_DATA, masterFileContents);
	
	var receivableAccountsFile = createNormalFile(receivableHost, 210, FILE_ICON_USER, receivableAccountsFileContents);
	setFileColumnCount(receivableAccountsFile, 2);
	setFileInitiallyCollapsed(receivableAccountsFile);
	var receivableDataFile = createNormalFile(receivableHost, 211, FILE_ICON_DATA, receivableDataFileContents);
	setFileColumnCount(receivableDataFile, 4);
	setFileInitiallyCollapsed(receivableDataFile);
	
	var payableAccountsFile = createNormalFile(payableHost, 220, FILE_ICON_USER, payableAccountsFileContents);
	setFileColumnCount(payableAccountsFile, 2);
	var payableDataFile = createNormalFile(payableHost, 221, FILE_ICON_DATA, payableDataFileContents);
	setFileColumnCount(payableDataFile, 4);
	
	var payrollAccountsFile = createNormalFile(payrollHost, 230, FILE_ICON_USER, payrollAccountsFileContents);
	setFileColumnCount(payrollAccountsFile, 2);
	var payrollDataFile = createNormalFile(payrollHost, 231, FILE_ICON_DATA, payrollDataFileContents);
	setFileColumnCount(payrollDataFile, 4);
	
	var recordsAccountsFile = createNormalFile(recordsHost, 240, FILE_ICON_USER, recordsAccountsFileContents);
	setFileColumnCount(recordsAccountsFile, 2);
	setFileInitiallyCollapsed(recordsAccountsFile);
	var recordsDataFile = createNormalFile(recordsHost, 241, FILE_ICON_DATA, recordsDataFileContents);
	setFileColumnCount(recordsDataFile, 3);
	setFileInitiallyCollapsed(recordsDataFile);
	
	// REQUIREMENTS
	
	var reqPayableAccountsFileContents = payableAccountsFileContents.slice();
	reqPayableAccountsFileContents.push(reqPayableAccountsFileContents.length/2 + 2000);
	reqPayableAccountsFileContents.push(masterFileContents[2]);
	
	requireChangeFile(payableAccountsFile, reqPayableAccountsFileContents, "Add the shell company to the list of accounts.");
	
	var reqPayableDataFileContents = payableDataFileContents.slice();
	
	reqPayableDataFileContents.push(2000 + reqPayableAccountsFileContents.length/2 - 1);
	reqPayableDataFileContents.push(dateRegisterValue);
	
	var reqDollars = 0;
	var reqCents = 0;
	
	for (let i = 0; i < payrollDataFileContents.length; i+=4)
	{ // 231 owed
		if ((payrollDataFileContents[i] == (GHAST_RP_ID + 3000)) || (payrollDataFileContents[i] == (MOSS_RP_ID + 3000)))
		{
			reqDollars += payrollDataFileContents[i+2];
			reqCents += payrollDataFileContents[i+3];
		}
	}

	for (let i = 0; i < payableDataFileContents.length; i+=4)
	{ // 221 paid
		if ((payableDataFileContents[i] == (GHAST_P_ID + 2000)) || (payableDataFileContents[i] == (MOSS_P_ID + 2000)))
		{
			reqDollars -= payableDataFileContents[i+2];
			reqCents -= payableDataFileContents[i+3];
		}
	}
	
	reqDollars += (reqCents / 100) | 0;
	reqCents %= 100;
	
	if (reqCents < 0) {
		reqDollars -= 1;
		reqCents += 100;
	}
	
	reqPayableDataFileContents.push(reqDollars);
	reqPayableDataFileContents.push(reqCents);
	
	// Always test for too big (over 9999) or negative results!
	//printConsole(reqDollars);
	//printConsole(reqCents);
	
	requireChangeFile(payableDataFile, reqPayableDataFileContents, "Issue a payment for the correct amount.");
}

function onCycleFinished() {
}
