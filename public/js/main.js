
	Vue.component('timesheet',{
		props: ['title','datatable'],
		template:`
		<div class="row">
			<div class="col-lg-12">
				<div class="ibox float-e-margins">
					<div class="ibox-title">
						<h5>{{title}} </h5>
						<div class="ibox-tools">
							<a type="button" href="#Add-Model" data-toggle="modal">
								<i class="fa fa-paste"></i>
								New Task 
							</a>
							<a class="dropdown-toggle" data-toggle="dropdown" href="#">
								<i class="fa fa-wrench"></i> Option
							</a>
							<ul class="dropdown-menu dropdown-user">
								<li><a href="#">ยังไม่ได้ทำรอก่อนนะ</a></li>
							</ul>
						</div>
					</div>
					<div class="ibox-content">
						<div><!-- ---------------------------------Table-------------------------------------------- -->
							
						</div>              
					</div>
				</div>
			</div>
		</div>
	`,
	});
	
	
var app = new Vue({
    el: '#wrapper',
    ready: function () {
        document.title = this.title;
    },
    data: {
		
        title: 'My Title',
		
		profile:[],
    },
    watch: {
        title: function (val, old) {
            document.title = val
        }
    },
	
	mounted(){
			document.title = this.title;
		}
})