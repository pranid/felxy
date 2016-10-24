<!DOCTYPE html>
<html>
<head>
	<title>Flexy (JQuery Calendar Grid)</title>
	<link rel="stylesheet" type="text/css" href="bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="font-awesome-4.6.3/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="flexy.css">
	<script type="text/javascript" src="jquery.min.js"></script>
	<script type="text/javascript" src="flexy.js"></script>
</head>
<body>
	<div class="container">
		<div class="col-sm-10 col-sm-offse-2">
			<div class="row">
				<div class="col-sm-3 col-sm-offset-7">
					<div class="form-group">
						<input type="date" name="from_date" value="" class="form-control" placeholder="From Date">
					</div>
				</div>
				<div class="col-sm-2">
					<button type="button" class="btn btn-primary" id="find-dates">Find Dates</button>
				</div>
			</div>
			<div id="flexy">

				<div class="row dgrid-alpha">
					<div class="dgrid-loader"></div>
					<!-- Flexible Date -->
					<div class="dgrid-main">
						<div class="dgrid dgrid-left">
							<div id="prev" class="btn btn-default btn-round backward" title="Click For More">
								<i class="fa fa-chevron-left" aria-hidden="true"></i>
							</div>
							<div class="dgrid-head">
								<h5 class='heading text-center'>Available Rooms</h5>
							</div>
							<div class="dgrid-body" id="room-type">
							</div>
						</div>
						<div class="dgrid dgrid-center">
							<div class="floating-calender">
								<div class="dgrid-head disable-select" id="dgrid-dates"></div>
								<div class="dgrid-body" id="dgrid-available">
								</div>
							</div>
						</div>
						<div class="dgrid dgrid-right">
							<div id="nxt" class="btn btn-default btn-round forward" title="Click For More">
								<i class="fa fa-chevron-right" aria-hidden="true"></i>
							</div>
							<div class="dgrid-head">
								<h5 class='heading text-center qnty-title'>Quantity</h5>
								<button class="btn btn-success btn-sm qnty-booknow" disabled="true">Book Now</button>
							</div>
							<div class="dgrid-body">
								<div id="book-now-main"></div>
							</div>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</body>
</html>
