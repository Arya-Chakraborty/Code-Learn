$("#compile").click(function(){
    var message = $('textarea#code').val();
    $.ajax({
      type: "POST",
      url: "/problems/compiler/compile/",
      data: {
        "code":message
      },
      dataType: "json",
      success: function(data) {
        var output = data["output"];
        var error = data["error"];
        if(output == ""){
          document.getElementById("output").innerHTML = "Nothing Yet"
        }
        else{
          document.getElementById("output").innerHTML = output;
        }
        if(error == ""){
          document.getElementById("error").innerHTML = "No Errors! Well Done Mate ;-)"
        } else{
          document.getElementById("error").innerHTML = error;
        }
      }
    });
})
// providing tab indentation when pressed tab key
document.getElementById('code').addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;
      // set textarea value to: text before caret + tab + text after caret
      this.value = this.value.substring(0, start) +
        "\t" + this.value.substring(end);
      // put caret at right position again
      this.selectionStart =
        this.selectionEnd = start + 1;
    }
  });

// autocomplete brackets quotes etc
document.getElementById('code').addEventListener('keydown', function(e) {
  const lis = ["()", "{}", "[]", "''", '""'];
  for(var i =0; i<lis.length; i++){
    if(lis[i][0] == e.key){
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;
      this.value = this.value.substring(0, start) + lis[i] + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 1;
    }
  }
});

