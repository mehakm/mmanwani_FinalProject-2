$(function() {   // when document is ready
  $('#test').mouseover(function(){ // query3 (CHAIN;footer) - .mouseover().css()
    $(this).css("background-color", "#F2F2F2");
    });
  $("h1").css("background-color", "black")



$("#enter").click(function(){
    //storing values from the url 
    var a= $("#searchword").val();


 $.ajax({
    url: '/getTweets/'+a, // building the url in the required format using the variables above
    type: 'GET',
    success: function(result) {
        console.log("search");
        result = JSON.parse(result);
        $.each(result, function(index, value){
          $('#AllTweets').append("<tr>" + "<th>"+"Tweet"+"</th>"+"<td>"+ value.tweet+"</td>"+"</tr>");
          $('#AllTweets').append("<tr>" + "<th>"+"Analysis Score"+"</th>"+"<td>"+ value.analysis_score+"</td>"+"</tr>");
          $('#AllTweets').append("<tr>" + "<th>"+"Positivity"+"</th>"+"<td>"+ value.positivity+"</td>"+"</tr>");
          $('#AllTweets').append("<tr>" + "<th>"+"Positive Words"+"</th>"+"<td>"+ value.positive_words+"</td>"+"</tr>");
          $('#AllTweets').append("<tr>" + "<th>"+"Negativity"+"</th>"+"<td>"+ value.negativity+"</td>"+"</tr>");
          $('#AllTweets').append("<tr>" + "<th>"+"Negative Words"+"</th>"+"<td>"+ value.negative_words+"</td>"+"</tr>");
          $('#AllTweets').append("<br/>");
          
          
        });

      }
    });
 }); 

$("#show").click(function(){

 $.ajax({
    url: '/getSavedTweets/all',
    type: 'GET',
    success: function(result) {
        console.log("show");
        result = JSON.parse(result);
        $.each(result, function(index, value){
          $('#Show').append("<tr>" + "<th>"+"Keyword"+"</th>"+"<th>"+"Tweet"+"</th>"+"<th>"+"Tweet ID"+"</th>"+"</tr>");
          $('#Show').append("<tr>" + "<td>"+value.keyword+"</td>"+"<td>"+value.tweet+"</td>"+"<td>"+value._id+"</td>"+"</tr>");
          $('#Show').append("<br/>");

        });

      }
    });
 });

$("#hide").click(function(){
  $('#Show').html("");
});


});

