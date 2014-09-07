var nbMines;
	var minesPos = Array();
	var boardDimension = {x:0, y:0};

	$(".btn").each(function(){
		$(this).click(function(){
			var tableau = $(this).val().split('x');
			boardDimension.x = parseInt(tableau[0]);
			boardDimension.y = parseInt(tableau[1]);
			switch(boardDimension.y){
				case 9:
					nbMines = 10;
				break;
				case 16:
					nbMines = 40;
				break;
				case 30:
					nbMines = 99;
				break;
				default:
					nbMines = 10;
				break;
			}
			generateFunction();
			dispatchMines();			
		});
	});

	$("#gameContainer").bind("contextmenu",function(){
       return false;
    });

	function generateFunction(size){
		$("#gameContainer").width(boardDimension.y*40);
		$("#gameContainer").height(boardDimension.x*40);
		$("#score").html(nbMines);
		$("#gameContainer").empty();
		startChronometer();
		for(var i = 1; i < boardDimension.x+1; i++){
			var line = "";
			for(var j = 1; j < boardDimension.y+1; j++){
				line += "<input type='button' class='button_mine' hasMine='false' id='"+i+"x"+j+"' value='' />";
			}
			$("#gameContainer").append("<div class='line'>"+line+"</div>");
		}
		$("#gameContainer").children().each(function(){
			$(this).children().each(function(){
				setListener($(this));
			});
		});
	}

	var time = 0;
	function startChronometer(){
		$(".top:eq(0)").attr("state", "shown");
		setInterval(function(){
			time++;
			var splitTime = (""+time).split("").reverse();
			$("#hundred").html(typeof(splitTime[2])=="undefined"?"0":splitTime[2]);
			$("#decade").html(typeof(splitTime[1])=="undefined"?"0":splitTime[1]);
			$("#unit").html(splitTime[0]);
		}, 1000);

	}

	function setListener(element){
		element.mousedown(function(event) {
		    switch (event.which) {
		    	// left click
		        case 1:
		        	if(element.attr("state") != "flag"){
				        if(element.attr("hasMine") == "true"){
				        	$("#gameContainer").children().each(function(){
								$(this).children().each(function(){
									if($(this).attr("hasMine") == "true"){
										$(this).attr("state", "mine");
									}
								});
							});
							element.css("background-color", "red");
							gameOver();
				        }
				        else{
				        	countCloseMines(element);
				        }
				    }
		        break;
		        case 2:
		            alert('Middle mouse button pressed');
		        break;
		        // right click
		        case 3:
		        	var tempScore = parseInt($("#score").html());
		            if(element.attr("state")=="flag"){
		            	element.removeAttr("state");
		            	tempScore++;
		            }
		            else if(element.attr("state")!="empty" &&
		            	element.attr("state")!="mine" &&
		            	element.val() == ""){
		            	element.attr("state", "flag");
		            	tempScore--;
		            }
		            $("#score").html(tempScore);
		        	if(tempScore == 0){
		        		checkMine();
		        	}
		        break;
		        default:
		            alert('You have a strange mouse');
		        break;
		    }
		});
	}

	function gameOver(){
		$("#gameContainer").children().each(function(){
			$(this).children().each(function(){
				$(this).unbind();
			});
		});
		endOfTheGame(false);
	}

	function dispatchMines(sizeArray){
		var pos = {x:0,y:0};
		for(var i = 0; i < nbMines; i++){
			pos.x = Math.ceil(Math.random()*boardDimension.x);
			pos.y = Math.ceil(Math.random()*boardDimension.y);
			if($("#"+pos.x+"x"+pos.y).attr("hasMine") != "true"){
				$("#"+pos.x+"x"+pos.y).attr("hasMine", "true");
			}
			else{
				i--;
			}
		}
	}

	function countCloseMines(element){
		var caseToCheck = Array();
		var nbMine = 0;
		var a = element.attr("id").split('x');
		var pos = {x:parseInt(a[0]), y:parseInt(a[1])};
		var x = "";
		var y = "";
		for(var i = -1; i < 2; i++){
			x = pos.x + i;
			if(x < 1){x++;i++;}
			if(x > boardDimension.x){
				break;
			}
			for(var j = -1; j < 2; j++){
				y = pos.y + j;
				if(y < 1){y++;j++;}
				if(y > boardDimension.y){
					break;
				}			
				if(!(i == 0 && j == 0)){
					if($("#"+x+"x"+y).attr("hasMine") == "true"){
						nbMine++;
					}
					else{
						caseToCheck.push($("#"+x+"x"+y));
					}
				}
			}
		}
		if(nbMine==0){
			element.attr("state", "empty");
			for(var o = 0; o < caseToCheck.length; o++){
				if(caseToCheck[o].val() == ""
					&& caseToCheck[o].attr("state") != "empty"){
					countCloseMines(caseToCheck[o]);
				}				
			}
		}
		else{
			switch(nbMine){
				case 1:
					element.css("color", "#3498DB");
				break;
				case 2:
					element.css("color", "#2ECC71");
				break;
				case 3:
					element.css("color", "#E74C3C");
				break;
				case 4:
					element.css("color", "#34495E");
				break;
				case 5:
					element.css("color", "#C0392B");
				break;
				case 6:
					element.css("color", "#1ABC9C");
				break;
			}
			element.val(""+nbMine);
		}
	}

	function checkMine(){
		var nbOfGoodMine = 0;
		$("#gameContainer").children().each(function(){
			$(this).children().each(function(){
				if($(this).attr("hasMine") == "true" && $(this).attr("state") == "flag"){
					nbOfGoodMine++;
				}
			});
		});
		console.log(nbOfGoodMine);
		if(nbOfGoodMine == nbMines){
			endOfTheGame(true);
		}
	}

	function endOfTheGame(win){
		$("#endOfGame h1").html(win?"Félécitation vous avez gagné !":"Vous avez perdu !");
		$("#endOfGame").attr("state", "shown");
	}

	function instantWin(){
		$("#gameContainer").children().each(function(){
			$(this).children().each(function(){
				if($(this).attr("hasMine") == "true"){
					$(this).trigger({
					    type: 'mousedown',
					    which: 3
					});
				}
			});
		});
	}