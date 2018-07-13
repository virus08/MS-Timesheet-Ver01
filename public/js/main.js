Vue.filter('formatDate', function(value) {
	if (value) {
		return moment(String(value)).format('Do MMMM YYYY')
	}
})
/*
Vue.component('test', { 
	 props: ['source'],
	 template: '<div>{{ list. }}</div>',
	 data: function () {
	    return {
	    	list: null
	    }
	  },
	  methods: {
		  getUsers: function(){
	            this.$http.get(this.source).then(function(response){
	                this.list = response.data;
	            }, function(error){
	                console.log(error.statusText);
	            });
	        }
	    },
	    mounted: function () {
	        this.getUsers();
	    }
	})
 */
/*====================================================================================================*/ 
	Vue.component('timesheet',{
		props: ['title','accountname','source'],
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
						<div>
							<v-client-table :data="list" :columns="columns" :options="options" class="table-responsive">
								<a slot="edit" slot-scope="props" class="fa fa-edit" href="#"></a>
							</v-client-table>
						</div>              
					</div>
				</div>
			</div>
		</div>
	`,
	data: function () {
	    return {
			list:[],
			columns: ['id', 'Job_Header', 'Job_detail','Job_Hours','Job_date','edit'],
			options: {
				headings: {
					id:'[iD]',
					Job_Header: 'Name',
					Job_detail: 'Detail',
					Job_Hours:'Hour',
					Job_date:'Deadline'
					//edit:'Action'
				},
				perPage:6,
				perPageValues:[6,10,15,30],
				dateColumns: ['Job_date'],
				sortable:['Job_Header','Job_detail','Job_Hours','Job_date'],
				filterable:['Job_Header','Job_detail','Job_date'],
				sortIcon: {
					is:'fa-sort',
					base:'fa',
					up:'fa-sort-up',
					down:'fa-sort-down'
				}
			}
	    }
	  },
	  methods: {
		  gettimesheet: function(){
			var Mydata;
			const reqapi = this.source 
			var api = reqapi + '?filter[where][Name_Surname]='+ this.accountname
			var api = api + '&filter[where][create_date][gt]=2018-01&filter[where][Job_date][gt]=2018-01'
			var api = api + '&filter[order]=id%20DESC&filter[limit]=100'
			$.ajax({
				url: api ,
				dataType: 'json',
				async: false,
				success: function(data) {
					Mydata = data
				}
			  });
			this.list=Mydata
		  }
	    },
	    mounted: function () {
	        this.gettimesheet();
	    }
	});	


Vue.use(VueTables.ClientTable);	
var app = new Vue().$mount('#wrapper')