window.addEventListener('load', main, false);
 var BlockImage = new Image;
		BlockImage.onload = function() {
		console.log('Loaded')
	} 
	BlockImage.src = 'popit5.png';
var BackImage = new Image;
	BackImage.onload = function() {
	console.log('Loaded')
	}
	BackImage.src = 'stroika2.jpg';
function main() {	
	var ctx = canvas_ex.getContext('2d');
	var w = canvas_ex.width;
	var h = canvas_ex.height;
	const vibing = 0;
	const falling = 1;
	const away = 3;
	const idle = 2;
	
	function Cube(x, y) {
		this.x = x;
		this.y = y;
		this.status = 0;
		this.w = 100;
		this.h = 100;
		this.vx = 200;
		this.vy = 0;
		this.ay = 0;
		this.alpha = 0;
		this.omega = 0;
		this.draw = ()=>{
			if (this.alpha==0) {
				ctx.drawImage(BlockImage, this.x, this.y, this.w, this.h);
			} else {
				ctx.translate(this.x+this.w/2, this.y+this.h/2);
				ctx.rotate(this.alpha);
				ctx.drawImage(BlockImage, -this.w/2, -this.h/2, this.w, this.h);
				ctx.rotate(-this.alpha);
				ctx.translate(-this.x-this.w/2, -this.y-this.h/2);
			}						
		}
	}
	
	var dt = 1/60;
	var cubes = [];
	var target = null;
	var lastCube = null;
	
	function init() {
		target = new Cube(w/2-50, h-100);
		target.status = falling;
		cubes.push(target);
	}
		
	function spawnNewCube() {
		target = new Cube(w/2, 0)
		cubes.push(target);
	}
		
	function dvig()
	{
		for (const cube of cubes) {
			if (lastCube != null){
			if ( lastCube.y< 2*h/3) 
			{
				cube.y+=200*dt;
			}
			if (lastCube.y> h-100) 
			{
				cube.y-=200*dt;
			}}
			cube.x+=cube.vx*dt;
			cube.vy +=cube.ay*dt;
			cube.alpha += cube.omega*dt;
			cube.y+=cube.vy*dt;
			
			if (cube.status == vibing) 
			{ 
				cube.y = 0;
				if (cube.x+cube.w>=w || cube.x<=0)
					cube.vx = - cube.vx;
				
			} else if (cube.status == falling)
			{
				if (cube.y+cube.h>=h && lastCube==null)
				{
					
					cube.y = h - cube.h;
					cube.status = idle;
					cube.vx = 0;
					cube.vy = 0;
					cube.ay =0;
					lastCube = cube;
					spawnNewCube();
				}
				else {
					if ( cube.y+cube.h>=lastCube.y ) 
					{
						if (cube.x>=lastCube.x && cube.x<= lastCube.x+lastCube.w)
						{
							
							if ( cube.x<=lastCube.x+lastCube.w/2 )
							{
								var flag = true;
								for (var i = cubes.length-2; i>0; i--) {
									var cm = 0;
									for ( var j = cubes.length-1; j>=i; j--) 
									{
										cm+= cubes[j].x +cubes[j].w/2;
								
									}
									cm = cm/(cubes.length-i);
									if ( cm < cubes[i-1].x || cm > cubes[i-1].x + cubes[i-1].w)
									{
										flag = false;
										for ( var j = cubes.length-1; j>=i; j--) 
										{
											cubes[j].status = away;
											cubes[j].vx = -300;
											cubes[j].omega = -10;
											cubes[j].vy = 300;
											lastCube = cubes[i-1];
										}
										spawnNewCube();
										
			
										
									}
									if (flag==false) {
										
										break;
									}
								}
								if (flag) {
									cube.y = lastCube.y - cube.h;
									cube.status = idle;
									cube.vx = 0;
									cube.vy = 0;
									cube.ay =0;
									lastCube = cube;
									spawnNewCube();
								}
								
							}
							else 
							{
								if (cube.y>h) {
									cubes.pop();
									spawnNewCube();
								}
								cube.vx = 300;
								cube.omega = 10;
							}
						}	
						else if (cube.x+cube.w>=lastCube.x && cube.x+cube.w<=lastCube.w+lastCube.x)
						{
						
							if ( cube.x+cube.w>=lastCube.x+lastCube.w/2 )
							{
								var flag = true;
								for (var i = cubes.length-2; i>0; i--) {
									var cm = 0;
									for ( var j = cubes.length-1; j>=i; j--) 
									{
										cm+= cubes[j].x +cubes[j].w/2;
								
									}
									cm = cm/(cubes.length-i);
									if ( cm < cubes[i-1].x || cm > cubes[i-1].x + cubes[i-1].w)
									{
										flag = false;
										for ( var j = cubes.length-1; j>=i; j--) 
										{
											cubes[j].status = away;
											cubes[j].vx = -300;
											cubes[j].vy = 300;
											cubes[j].omega = -10;
											lastCube = cubes[i-1];
										}
										spawnNewCube();
									}
									if (flag==false) {
										break;
									}
								}
								if (flag) {
									cube.y = lastCube.y - cube.h;
									cube.status = idle;
									cube.vx = 0;
									cube.vy = 0;
									cube.ay =0;
									lastCube = cube;
									spawnNewCube();
								}
							}
							else 
							{
								if (cube.y>h)
								{
									cubes.pop();
									spawnNewCube();
							
								}
								cube.vx = -300;
								cube.omega = -10;
								
								
							}
						}
						else 
						{
							if (cube.y>h) {
								cubes.pop();
								spawnNewCube();
							}
						}
					}
				}
			} else if (cube.status == idle) {
				
			}
			
			
		}
	}
	
	function draw()
	{
		ctx.clearRect(0,0,w,h);
		ctx.drawImage(BackImage, 0, 0,w, h);
		for (const cube of cubes) {
			cube.draw();
		}
		
	}
		
	function control()
	{
		dvig();
		draw();
	}

	
	canvas_ex.onclick = (e)=>{
		target.status = falling;
		target.vx = 0;
		target.vy = 300;
		target.ay = 100;
		target = null;
	}
	
	init();
	setInterval(control, 1000*dt);
	
}
	
	
	

	 
	
	
	