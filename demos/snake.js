// global variables
var size = 460;
var cell_size = 20;
var snake=[];
var food={x:0,y:0};
var context;
var dir_x = {right:1,left:-1,up:0,down:0};
var dir_y = {right:0,left:0,up:-1,down:1};
var direction = 'right';
var interval;
var score=0;

var colors = {background:'white',border:'black',food:'gray',snake:'blue'};

$(document).on('ready',function(){
	var canvas = $("#canvas_snake")[0];
	canvas.width=size;
	canvas.height=size;

	context = canvas.getContext("2d");

	init_snake();
	create_food();

	interval = setInterval(draw_frame,100);
});
// -------------= =-------------
function init_snake()
{
	for(var i=5;i>=1;i--)
		snake.push({x:i,y:3});
}
// -------------= =-------------
function create_food()
{
	var total_cells = parseInt(size/cell_size);

	do{
		food.x = parseInt(Math.random() * total_cells);
		food.y = parseInt(Math.random() * total_cells);
	}while(check_collision(food,snake));
}
// -------------= =-------------
function draw_frame()
{
	context.fillStyle=colors.background;
	context.fillRect(0,0,size,size);

	context.strokeStyle=colors.border;
	context.strokeRect(0,0,size,size);

	var pos = snake[0];

	var new_pos = {x: pos.x + dir_x[direction],y: pos.y + dir_y[direction]};

	var cell_rows = parseInt(size/cell_size);

	if(new_pos.x < 0 || new_pos.x >= cell_rows ||
	   new_pos.y < 0 || new_pos.y >= cell_rows 
		|| check_collision(new_pos,snake))
	{
		clearInterval(interval);
	}

	if(new_pos.x == food.x && new_pos.y == food.y){
		score++;
		create_food();
	}
	else
		snake.pop();

	snake.unshift(new_pos);

	// draw snake
	for(var i in snake){
		var cell = snake[i];

		context.fillStyle = colors.snake;
		context.fillRect(cell.x * cell_size, cell.y * cell_size, cell_size, cell_size);

		context.strokeStyle = colors.background;
		context.strokeRect(cell.x * cell_size, cell.y * cell_size, cell_size, cell_size);
	}

	// draw food
	context.fillStyle = colors.food;
	context.fillRect(food.x * cell_size, food.y * cell_size, cell_size, cell_size);
	context.strokeStyle = colors.background;
	context.strokeRect(food.x * cell_size, food.y * cell_size, cell_size, cell_size);
}
// -------------= =-------------
function check_collision(pos, array_pos)
{
	for(var i in array_pos){
		var pos_in_arr = array_pos[i];
		if(pos_in_arr.x == pos.x && pos_in_arr.y == pos.y)
			return true;
	}

	return false;
}
// -------------= =-------------
$(document).on('keydown',function(e){
	var key = e.which;

	switch(key){
		case 40:  // down
			if(direction!='up') direction='down';
			break;
		case 38: // up
			if(direction!='down') direction='up';
			break;
		case 37: // left
			if(direction!='right') direction='left';
			break;
		case 39: // right
			if(direction!='left') direction='right';
			break;

	}
});
// -------------= =-------------
// -------------= =-------------
// -------------= =-------------
// -------------= =-------------