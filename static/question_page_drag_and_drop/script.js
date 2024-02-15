$( init('.draggable',"#green", "targetGreen") );

function init(drag_elem, drop_area, target_text) {
  $(drag_elem).draggable({
    opacity:0.7, helper:"clone",
    stop: function(event, ui) {
      var coords = $(drop_area).position();
      coords.bottom = coords.top + $(drop_area).height();
      coords.bottomRight = coords.left + $(drop_area).width();
        if(ui.position.top >= coords.top && ui.position.top <= coords.bottom && ui.position.left >= coords.left && ui.position.left <= coords.bottomRight){
            document.getElementById(target_text).innerHTML = "<img src='/static/question_page_rearrange/tick.png' width='100' height='100'  style= 'display: block;margin-left: auto; margin-right: auto;margin-top: auto; margin-bottom: auto;'>";
        }else{
            document.getElementById(target_text).innerHTML = "Outside!" 
        }
    }
 });
}
function modify_size(element){
  $(element).draggable();
  $(element).resizable({
    stop: function(event, ui){
      var height = $(element).height();
      var width = $(element).width();
    }
  })
}

$( modify_size('#green') )

// function drag_and_drop(drag_elem, target_area){
//   $(drag_elem).draggable();
//   $(target_area).droppable({
//     drop: function(event, ui){
//       console.log("Inside")
//     }
//   });
// }