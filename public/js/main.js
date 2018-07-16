Vue.filter('formatDate', function(value) {
	if (value) {
		return moment(String(value)).format('D MMMM YY')
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


Vue.component('edit', { 
	 props: ['source','id'],
	 template: `
	 			<a type="button" href="#edit-model" data-toggle="modal" class="btn btn-info ">
					<i class="fa fa-pencil-square-o"></i> Edit {{ id }}
				</a>
	 `,
	 data: function () {
	    return {
	    	data: null
	    }
	  },
	  methods: {
		  getdata : function(){
	            
	        }
	    },
	    mounted: function () {
	        
	    }
	})


/*====================================================================================================*/ 
	Vue.component('timesheet',{
		props: ['title','accountname','source','uid'],
		template:`
		<div class="row">
			<div class="col-lg-12">
				<div class="ibox float-e-margins">
					<div class="ibox-title">
						<h5>{{title}} </h5>
						<div class="ibox-tools">
							<a type="button" href="#Add-Model" data-toggle="modal" @click="clickNewTask()">
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
					<v-app class="ibox-content">
						<v-card>
							<v-card-title>
								{{title}}
								<v-spacer></v-spacer>
								<v-text-field
								v-model="search"
								append-icon="search"
								label="Search"
								single-line
								hide-details
								></v-text-field>
							</v-card-title>

							<v-data-table
								:headers="headers"
								:items="list"
								:search="search"
								disable-initial-sort
								class="table table-striped"
								>
								
								<template slot="items" slot-scope="props">
									<td>{{ props.item.id }}</td>
									<td class="text-xs-right">{{ props.item.Job_Header }}</td>
									<td class="text-xs-left">{{ props.item.Job_detail }}</td>
									<td class="text-xs-right">{{ props.item.Job_Hours }}</td>
									<td class="text-xs-right">{{ props.item.Job_date | formatDate }}</td>
									<td class="text-xs-right">
									<a type="button" href="#edit-model" data-toggle="modal" class="btn btn-info " @click="edit(props.item)">
										<i class="fa fa-pencil-square-o"></i> Edit {{ props.item.id }}
									</a>
									</td>
								</template>
								<v-alert slot="no-results" :value="true" color="error" icon="warning">
									Your search for "{{ search }}" found no results.
								</v-alert>
							</v-data-table>
						</v-card>       
					</v-app>
				</div>
			</div>
			<!-- ---------------------------------Edit Model-------------------------------------------- -->
			<div id="edit-model" class="modal fade" aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-body">
							<div class="row">
							<p> <center> <h1>Edit {{edTimesheet.id}} </h1> </center>
							<hr>
						<div class="col-sm-6">
							<div class="form-group">
								<p><label>Job Name</label> {{edTimesheet.Job_Header}} </p>
								<p><label>Job Type</label> {{edTimesheet.Job_Type}} </p>
								<p><label>SoW</label> {{edTimesheet.Job_SOW}}</p>
								<p><label>Job Hours</label> {{edTimesheet.Job_Hours}}</p>
								<p><label>Deadline</label> {{edTimesheet.Job_date | formatDate}} </p>
								<label>Brands</label>
								<ul>
									<li v-for="tech in edTimesheet.Brands">{{tech}}</li>
								</ul>
								<label>Base On Technology</label>
								<ul>
									<li v-for="tech in edTimesheet.Base_Technology">{{tech}}</li>
								</ul>
								<label>Contact</label>
									<ul>
										<li v-for="contact in edTimesheet.contract">{{contact}}</li>
									</ul>
								</div>		
							</div>
							<div class="col-sm-6">
								<div class="form-group">
									<label>Job Name</label> 
									<input type="text" v-model="edTimesheet.Job_Header" placeholder="ชื่องาน" class="form-control">
									<label>Scope Of Works</label> 
									<select class="form-control m-b" v-model="edTimesheet.Job_SOW" @change="changeSOW()">
										<option v-for="option in edSOW" :value="option.Name"> {{option.Name}}&nbsp;[{{option.Hours}}]</option>
									</select>
									<label>Job Detail</label> 
									<textarea type="text" v-model="edTimesheet.Job_detail" placeholder="รายละเอียด" class="form-control" rows="5"></textarea>
									<label>Project-Track</label> 
									<select class="form-control m-b" v-model="edTimesheet.Projid" >
										<option v-for="option in edProj" :value="option.id"> {{option.Name}}&nbsp;[{{option.id}}]</option>
									</select>
								</div>
							</div>
						</div>
						<div >
						<hr>
							<a class="btn btn-info pull-left" type="button"  data-toggle="modal" href="#edit-model" @click="taskDelete(edTimesheet.id)">
								<i class="fa fa-eraser"></i>
								Delete  
							</a>
							<a class="btn btn-info pull-right" type="button" v-if="!this.edTimesheet.disable"  data-toggle="modal" href="#edit-model" @click="taskUpdate(edTimesheet)">
								<i class="fa fa-save"></i>
								Update 
							</a>
							<a class="btn btn-warning pull-right" type="button" v-if="this.edTimesheet.disable"  data-toggle="modal" href="#edit-model">
								<i class="fa fa-ban"></i>
								Cancel 
							</a>
							<br>
						</div>         
					</div>
				</div>
			</div>
		<!-- ---------------------------------Edit Model-------------------------------------------- -->
		<!-- ---------------------------------Add Model-------------------------------------------- -->
			<div id="Add-Model" class="modal fade" aria-hidden="true">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-body">
								<div class="row">
									<center> 
										<p>{{uid}}</p>
									</center>
									<hr>
									<div class="col-sm-6">
										<div class="form-group">
											<label>Job Name</label> 
											<input type="text" v-model="newTask.Job_Header" placeholder="ชื่องาน" class="form-control">
											<label>Job Detail</label> 
											<textarea type="text" v-model="newTask.Job_detail" placeholder="รายละเอียด" class="form-control" rows="4"></textarea>
											<label>Job Group</label>
											<select class="form-control m-b" v-model="newTask.Job_Type" @change="changeType()">
													<option v-for="option in adJobType" :value="option.Name"> {{option.Name}}</option>
											</select>
											<label>Job SOW</label>
											<select class="form-control m-b" v-model="newTask.Job_SOW">
													<option v-for="option in edSOW" :value="option.Name"> {{option.Name}}&nbsp;[{{option.Hours}}]</option>
											</select>
											<label>Project-Track</label> 	
											<select class="form-control m-b" v-model="newTask.Projid" >
												<option v-for="option in edProj" :value="option.id"> {{option.Name}}&nbsp;[{{option.id}}]</option>
											</select>
										</div>		
									</div>
									<div class="col-sm-6">
										<div class="form-group">
											
											<label>Deadline</label>
											<input type="date" placeholder="วันส่งงาน" class="form-control" v-model="newTask.Job_date">
											<label>Base On Technology</label>
											<select multiple="multiple" size="8" class="form-control" v-model="newTask.Base_Technology">
												<option v-for= "option in adTech" :value="option.Name"> {{option.Name}} </option>
											</select>
											<label>Base On Brand</label>
											<select multiple="multiple" size="6" class="form-control" v-model="newTask.Brands">
												<option v-for= "option in adBrand" :value="option.Name"> {{option.Name}} </option>
											</select>
										</div>
									</div>
								</div>
							<div>
							<hr>
								<a class="btn btn-info pull-right" type="button"  data-toggle="modal" href="#Add-Model" @click="AddNewTask()">
									<i class="fa fa-save"></i>
									Add Task 
								</a>
								<br>
							</div>         
						</div>
					</div>
				</div>
			</div>
			<!-- ----------------------------------End Add Model----------------------------------- -->
			</div>
		</div>
	`,
	data: function () {
	    return {
			list:[],
//
			newTask:{
				"UID": 0,
				"Name_Surname": "",
				"Job_Type": "",
				"Job_SOW": "",
				"Job_Hours": 0,
				"Base_Technology": [],
				"contract": [],				
				"remark": [],
				"Brands": [],
				"Projid": "",
				"Job_Header": "",
				"Job_detail": "",
				"create_date": Date.now(),
				"Job_date": Date.now(),
				"modify_date": Date.now(),
				"Job_progress": 100,
				"Job_status": "Completed",
				"Completed_date": Date.now()
			},
			adJobType:{},
			adTech:{},
			adBrand:{},
//
			edTimesheet:{},
			edSOW:[],
			edProj:{},
			search: '',
			headers: [
				{ text: 'iD',sortable: true,width: '30px',  value: 'id'},
				{ text: 'Name', align: 'right', width: '400px', sortable: false, value: 'Job_Header' },
				{ text: 'Detail', align: 'center',width: '600px',sortable: false, value: 'Job_detail' },
				{ text: 'Hour', align: 'right', width: '100px',sortable: false, value: 'Job_Hours' },
				{ text: 'Deadline', align: 'right', width: '180px',sortable: true,value: 'Job_date' },
				{ text: 'Action', align: 'right', width: '100px', sortable: false, value: 'action' }
			  ]
			
	    }
	  },
	  methods: {
		  gettimesheet: function(){
			var Mydata;
			const reqapi = this.source + '/api/timesheets'
			var api = reqapi + '?filter[where][Name_Surname]='+ this.accountname
			var api = api + '&filter[where][create_date][gt]=2018-01&filter[where][Job_date][gt]=2018-01'
			var api = api + '&filter[order]=id%20DESC&filter[limit]=30'
			this.$http.get(api).then(response => {
				this.list = response.body;
			}, response => {
				aletr(response)
			});
		  },
///=====================================		
		  clickNewTask : function(){
			this.getProject();
			this.getadJobType();
			this.getadTech();
			this.getadBand();
			this.newTask.Job_date= moment().format("YYYY-MM-DD")
		  },
		  getadJobType : function(){
			  var API = this.source +'/api/jobtypes'
			  this.$http.get(API).then((response) => {
				//success
				this.adJobType = response.body
				// this.GroupName = this.Sow_lists[0].GroupName
				//alert(this.edSOW)
			  }, (response) => {
				  //error
				  alert(response.body.error.message)
			  });
		  },
		  getadTech : function(){
			var API = this.source +'/api/teches'
			this.$http.get(API).then((response) => {
			  //success
			  this.adTech = response.body
			  // this.GroupName = this.Sow_lists[0].GroupName
			  //alert(this.edSOW)
			}, (response) => {
				//error
				alert(response.body.error.message)
			});
		  },
		  getadBand : function(){
			var API = this.source +'/api/brands'
			this.$http.get(API).then((response) => {
			  //success
			  this.adBrand = response.body
			  // this.GroupName = this.Sow_lists[0].GroupName
			  //alert(this.edSOW)
			}, (response) => {
				//error
				alert(response.body.error.message)
			});
		  },
		  changeType : function(){
			var API = this.source + '/api/sows'
			var API_SOW_By_GroupName = API+ '?filter[where][GroupName]='+ this.newTask.Job_Type
			this.$http.get(API_SOW_By_GroupName).then(response => {
				this.edSOW = response.body;
				}, response => {
					aletr(response)
				});
		  },
		  AddNewTask : function (myTimesheet){
			var API = this.source + '/api/timesheets'
			var API_AddNewTask = API
			this.newTask.Name_Surname = this.accountname;
			this.newTask.UID = this.uid;
			//myTimesheet.modify_date = Date.now()
			this.newTask.Job_Hours = this.edSOW.filter(list => list.Name == this.newTask.Job_SOW )[0].Hours
			this.$http.post(API_AddNewTask,this.newTask).then((response) => {
				  //success
				// alert('Add:'+ response.body.Job_Header+'On'+response.body.modify_date)
				this.gettimesheet();
				this.newTask= {}
				}, (response) => {
				//error
				alert(response.body.error.message)
				});
			},

///=====================================
		  getProject : function () {
			var API = this.source + '/api/projects'
			//var UID = '1'
			var API_PROJECT_By_accountname = API + '?filter[where][accountname]='+this.accountname
			this.$http.get(API_PROJECT_By_accountname).then((response) => {
			  //success
			  this.edProj = response.body
			  // this.GroupName = this.Sow_lists[0].GroupName
			  //alert(this.edSOW)
			}, (response) => {
				//error
				alert(response.body.error.message)
			});
		  },
		  edit: function(xTimesheet){
			  //alert(mid)
			this.getProject(); 
			this.edTimesheet = this.edTimesheet= xTimesheet;
			this.getSOW(this.edTimesheet.Job_Type)
		  },
		  taskDelete : function (ID_Timesheet){
			//alert('delete'+ID_Timesheet)
			var API = this.source+'/api/timesheets'
			var API_Delete_By_Task_Id = API+'/'+ID_Timesheet
			this.$http.delete(API_Delete_By_Task_Id).then((response) => {
				  //success
				 //alert('Delete'+ID_Timesheet+' '+response.body.count)
				 console.log(response.count);
				 this.gettimesheet();
				}, (response) => {
				//error
				alert(response.body.error.message)
				});
		  },
		  taskUpdate : function (myTimesheet){
			var API = this.source+'/api/timesheets'
			var API_Update_By_Task_Id = API + '/' + myTimesheet.id
			myTimesheet.modify_date = Date.now()
			this.$http.put(API_Update_By_Task_Id,myTimesheet).then((response) => {
				  //success
				 //alert('Update:'+ response.body.Job_Header+'On'+response.body.modify_date)
				this.gettimesheet();
				this.edTimesheet= {}
				}, (response) => {
				//error
				alert(response.body.error.message)
				});
		  },
		  changeSOW : function(){
			this.edTimesheet.Job_Hours = this.edSOW.filter(list => list.Name == this.edTimesheet.Job_SOW )[0].Hours
		  },
		  getSOW : function (xGroup) {
			var Mydata;
			var API = this.source + '/api/sows'
			var API_SOW_By_GroupName = API+ '?filter[where][GroupName]='+ xGroup
			this.$http.get(API_SOW_By_GroupName).then(response => {
				this.edSOW = response.body;
				if (this.edSOW.length){

					this.edSOW = response.body;
				}else {
					this.edSOW=[ 
						{
							GroupName:"Error",
							Hours :	0,
							Name: "Someting Worng"
						}]
					this.edTimesheet.Job_SOW= "Someting Worng"
					this.edTimesheet.disable=true;
				}
			}, response => {
				aletr(response)
			});
		  },	
	    },
	    mounted: function () {
	        this.gettimesheet();
	    }
	});	

/*
Vue.use(VueTables.ClientTable,{
	compileTemplates: true,
	datepickerOptions: {
	  showDropdowns: true
	}
});	*/
//var Vue = require('vue');
//var VueResource = require('vue-resource');

Vue.use(VueResource);

var app = new Vue().$mount('#wrapper')