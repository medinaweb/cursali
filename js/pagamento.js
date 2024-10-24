function fazerPagamento() {
    var posID = "90051";
    var posAutCode = "123456789A";
    var amount = "10000"; // valor do curso em escudos
    var merchantRef = "R" + moment().format('YYYYMMDDHHmmss');
    var merchantSession = "S" + moment().format('YYYYMMDDHHmmss');
    var dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    var responseUrl = "https://www.seusite.com/resposta-pagamento";

    var formData = {
        transactionCode: "1",
        posID: posID,
        merchantRef: merchantRef,
        merchantSession: merchantSession,
        amount: amount,
        currency: "132",
        is3DSec: "1",
        urlMerchantResponse: responseUrl,
        languageMessages: "pt",
        timeStamp: dateTime,
        fingerprintversion: "1",
        entityCode: "",
        referenceNumber: ""
    };

    formData.fingerprint = gerarFingerPrintEnvio(
        posAutCode, formData.timeStamp, formData.amount,
        formData.merchantRef, formData.merchantSession, formData.posID,
        formData.currency, formData.transactionCode, formData.entityCode, formData.referenceNumber
    );

    var postURL = "https://mc.vinti4net.cv/Client_VbV_v2/biz_vbv_clientdata.jsp?FingerPrint=" 
        + encodeURIComponent(formData.fingerprint) 
        + "&TimeStamp=" + encodeURIComponent(formData.timeStamp) 
        + "&FingerPrintVersion=" + encodeURIComponent(formData.fingerprintversion);

    // Criar um formulário para fazer o post automático
    var formHtml = "<form action='" + postURL + "' method='post'>";
    Object.keys(formData).forEach(function(key) {
        formHtml += "<input type='hidden' name='" + key + "' value='" + formData[key] + "'>";
    });
    formHtml += "</form>";
    var autoPost = document.createElement('div');
    autoPost.innerHTML = formHtml;
    document.body.appendChild(autoPost);
    autoPost.querySelector('form').submit();
}

function gerarFingerPrintEnvio(posAutCode, timestamp, amount, merchantRef, merchantSession, posID, currency, transactionCode, entityCode, referenceNumber) {
    var toHash = GenerateSHA512StringToBase64(posAutCode) + timestamp + (Number(parseFloat(amount) * 1000)) +
        merchantRef.trim() + merchantSession.trim() + posID.trim() +
        currency.trim() + transactionCode.trim();
    if (entityCode) toHash += Number(entityCode.trim());
    if (referenceNumber) toHash += Number(referenceNumber.trim());
    return GenerateSHA512StringToBase64(toHash);
}

function ToBase64(u8) {
    return btoa(String.fromCharCode.apply(null, u8));
}

function GenerateSHA512StringToBase64(input) {
    return ToBase64(sha512.digest(input));
}