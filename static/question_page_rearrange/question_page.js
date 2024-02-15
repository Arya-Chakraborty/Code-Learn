$(function(){
    $('tbody').sortable(); 
    $("#temp_table").hide();
    $("#spinner").hide();
    $('#notepad').hide();
    $("#correct_answer").hide();
    $("#wrong_answer").hide();
});

// for the converter to json
function tableToJson(table){
var data = [];
// first row needs to be headers
var headers = [];
for(var i=0; i<table.rows[0].cells.length; i++){
    headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi,'');
}
// go through cells
for(var i=1; i<table.rows.length; i++){
    var tableRow = table.rows[i];
    var rowData = {};
    for(var j=0; j<tableRow.cells.length; j++){
        rowData[headers[j]] = tableRow.cells[j].innerHTML;
    }
    data.push(rowData);
}
return data;
}

// for the results section and the spinner
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
 }
$('#test_code').click(async function(){
var table = tableToJson(document.getElementById("table1"));
var length_of_arr = table.length;
var indices = [];
for(i=0; i < length_of_arr; i++){
    indices[i] = JSON.stringify(table[i]["code"]);
}
var ans = tableToJson(document.getElementById("temp_table"));
var length_of_arr = ans.length;
var answer = [];
for(i=0; i < length_of_arr; i++){
    answer[i] = JSON.stringify(ans[i]["code"]);
}
if(JSON.stringify(indices) == JSON.stringify(answer)){
    $("#ans_message").fadeOut('slow').hide();
    $("#spinner").fadeIn('slow').delay(3000).fadeOut('slow');
    await sleep(5000);
    $("#correct_answer").fadeIn("slow").delay(2000).fadeOut("slow");
    await sleep(4000);
    document.getElementById("ans_message").style["color"] = "#1eff45";
    document.getElementById("ans_message").innerHTML = "Right Answer!! Now Submit you Answer.";
    $("#ans_message").fadeIn('slow');
}
else{
    $("#ans_message").fadeOut('slow').hide();
    $("#spinner").fadeIn('slow').delay(3000).fadeOut('slow');
    await sleep(5000);
    $("#wrong_answer").fadeIn("slow").delay(2000).fadeOut("slow");
    await sleep(4000);
    document.getElementById("ans_message").style["color"] = "red";
    var lis_of_messages = ["Sorry, but you're wrong.", "Mate something's wrong, Try Again!", "It seems like your answer is Wrong!", "Hey, your answer is wrong. Please Try again!"]
    var message = lis_of_messages[Math.floor(Math.random() * lis_of_messages.length)]
    document.getElementById("ans_message").innerHTML = message;
    $("#ans_message").fadeIn('slow');
}
}); 

// for the notepad
var text_area = false;
$('#notepad_button').click(function(){
    if(text_area == false){
        $('#notepad').fadeIn('slow');
        document.getElementById("notepad_button").innerHTML = "Hide Notepad";
        text_area = true;
    }
    else{
        $('#notepad').fadeOut('slow');
        document.getElementById("notepad_button").innerHTML = "Show Notepad";
        text_area = false;
    }
})

// for the submit button
$('#submit_button').click(async function(){
var table = tableToJson(document.getElementById("table1"));
var length_of_arr = table.length;
var indices = [];
for(i=0; i < length_of_arr; i++){
    indices[i] = JSON.stringify(table[i]["code"]);
}
var ans = tableToJson(document.getElementById("temp_table"));
var length_of_arr = ans.length;
var answer = [];
for(i=0; i < length_of_arr; i++){
    answer[i] = JSON.stringify(ans[i]["code"]);
}
if(JSON.stringify(indices) == JSON.stringify(answer)){
    $("#ans_message").fadeOut('slow').hide();
    $("#spinner").fadeIn('slow').delay(3000).fadeOut('slow');
    await sleep(5000);
    $("#correct_answer").fadeIn("slow").delay(2000).fadeOut("slow");
    await sleep(4000);
    var code = document.getElementById("code").innerHTML;
    var solved_key = document.getElementById("solved_key").innerHTML;
    var encrypted_code = document.getElementById("encrpyted_code").innerHTML;
    var url = document.getElementById("path").className;
    var prob_id = document.getElementById("path").innerHTML;
    var new_url = url + "&c="+code+"&ec="+encrypted_code+"&solved_id="+prob_id+"&solved_key="+solved_key
    location.href=new_url;
}
else{
    $("#ans_message").fadeOut('slow').hide();
    $("#spinner").fadeIn('slow').delay(3000).fadeOut('slow');
    await sleep(5000);
    $("#wrong_answer").fadeIn("slow").delay(2000).fadeOut("slow");
    await sleep(4000);
    document.getElementById("ans_message").style["color"] = "red";
    var lis_of_messages = ["Sorry, but you're wrong.", "Mate something's wrong, Try Again!", "It seems like your answer is Wrong!", "Hey, your answer is wrong. Please Try again!"]
    var message = lis_of_messages[Math.floor(Math.random() * lis_of_messages.length)]
    document.getElementById("ans_message").innerHTML = message;
    $("#ans_message").fadeIn('slow');
}
});