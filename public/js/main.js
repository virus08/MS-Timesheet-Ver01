const apiroot =  'http://es-timesheet.fuangmali.info:8081/api'
// http://localhost:8080/api/users/login

window.API = {
    ROOT: apiroot ,
    USER: apiroot +'/users/',
    LOGIN: apiroot + '/users/login',
    PROFILE: apiroot + '/profiles/',
    TIMESHEET: apiroot + '/Timesheets',
    SOW :apiroot + '/sows',
    PROJECT :apiroot + '/projects',
    TASKGROP :apiroot + '/jobtypes',
    BRANDS:apiroot + '/brands',
    TECH:apiroot + '/teches'
}

Vue.filter('formatDate', function(value) {
	if (value) {
		return moment(String(value)).format('D MMMM YY')
	}
})
Vue.filter('formatDateTz', function(value) {
	if (value) {
		var mydate=moment.tz(value,'UTC');
		return mydate.clone().tz('Asia/Bangkok').format('D MMMM YY h:mm a')
	}
})


Vue.filter('formattime', function(value) {
	if (value) {
		return moment(String(value)).format(' D MMMM YY h:mm a')
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

Vue.component('task', { 
	props: ['Project'],
	template: `
	<div :id="'faq'+Project.id" class="panel-collapse collapse faq-answer">
    <div class="row" v-for="task in tasklists">
      <div class="col-md-4">
        {{task.Job_Header}}
      </div>
      <div class="col-md-5">
        {{task.Job_detail}}
      </div>
      <div class="col-md-2">
       <span class="tag-item"> {{task.Name_Surname}} </span>
      </div>
      <div class="col-md-1">
        <a type="button" @click="removetaskfromproj(task)">
							<i class="fa fa-times-circle-o"></i> 
				</a>
      </div>
    </div>
    <div class="row">
      <div class="col-md-10"></div>
      <div class="col-md-2 text-right">
        <hr>
        <a href="#" class="btn btn-white btn-sm" v-if="tasklists.length==0" @click="removeproj(Project.id)"><i class="fa fa-times"></i> Delete </a>
      </div>
    </div>
    
  </div>
	`,
	data: function () {
	   return {
		   tasklists: {}
	   }
	 },
	 methods: {
		removeproj:function(projid){
			var API = 'http://'
					var API_Remove_By_Proj_Id = API.PROJECT + '/' + projid
					//Proj.modify_date = Date.now()
					this.$http.delete(API_Remove_By_Proj_Id).then((response) => {
							//success
					  //alert('Update:'+ response.body.Job_Header+'On'+response.body.modify_date)
					  location.reload()
					  }, (response) => {
					  //error
					  alert(response.body.error.message)
					  });
				},
			removetaskfromproj:function(mytask){
			var API = window.API
				var API_Update_By_Task_Id = API.TIMESHEET + '/' + mytask.id
				mytask.modify_date = Date.now()
				mytask.project=''
				mytask.Projid=''
				this.$http.put(API_Update_By_Task_Id,mytask).then((response) => {
						//success
				  //alert('Update:'+ response.body.Job_Header+'On'+response.body.modify_date)
				  this.getTimesheet();
				  //this.edTimesheet= {}
				  }, (response) => {
				  //error
				  alert(response.body.error.message)
				  });
			  },
			getTimesheet: function () {
			  var API = window.API
			  var API_Timesheet_By_project_ID = API.TIMESHEET + '?filter[where][Projid]='+ this.Project.id 
			  this.$http.get(API_Timesheet_By_project_ID).then((response) => {
				//success
				this.tasklists = response.body
			  }, (response) => {
	  
				//error
				alert(response.body.error.message)
			  });
			}
		},
		created: function () {
			this.getTimesheet();
		},
		mounted: function () {
		  
		}
   })

Vue.component('project', { 
	props: ['source','uid'],
	template: `
	<div class="row">
    <div class="col-lg-12">
      <div class="wrapper wrapper-content animated fadeInRight">
        <div class="ibox-content m-b-sm border-bottom">
          <div class="text-center p-lg">
            <h2> All projects assigned to this account</h2>
            <div class="text-center p-lg">
                                <span>add your Project </span>
                                <a href="#addproject" data-toggle="modal" title="Create new project" class="btn btn-primary btn-sm"><i class="fa fa-plus"></i> <span class="bold">Add Project </span></a> button
                            </div>
          </div>
        </div>  
        <!-- -->
        <div class="faq-item" v-for="project in ProjectList">
          <div class="row">
            <div class="col-md-9">
              <div class="row">
                <a data-toggle="collapse" :href="'#faq'+ project.id " class="faq-question"> {{project.Name}} </a>
              </div>
              <div class="row">
                 <p>{{project.Desc}}</p> 
              </div>
            </div>
            <div class="col-md-2">
              <span class="small font-bold">Tag</span>
              <div class="tag-list">
                <p>
                  <span class="tag-item">Project ID: ({{project.id}})</span>
                  <span class="tag-item">{{project.Status}}</span>
                </p>
                <p>
                  <span class="tag-item">Last Update: {{project.Modify_date | formatDate}}</span>
                </p>
              </div>
            </div>
            <div class="col-md-1">
              <a href="#editproject" data-toggle="modal" class="btn btn-white btn-sm" @click="ProjEdit(project)"><i class="fa fa-pencil"></i> Edit </a>
            </div>
          </div>
          <div class="row">
            <task :Project="project"></task>
            
          </div>
      </div>
      <!-- -->
    </div>
  </div>
  <div id="editproject" class="modal fade" >
      <div class="modal-dialog">
        <div class="modal-content">
		 				<div class="modal-body">
		 					<div class="row">
		 						<div class="form-group">
		 							<label>Project Name</label> <input type="string" v-model="edProj.Name" placeholder="ชื่อโครงการ"  class="form-control">
		 							<label>Project Description</label> <textarea type="string" rows="5" v-model="edProj.Desc" placeholder="รายละเอียดโครงการ"  class="form-control" />
		 							<label>Type</label>
		 							<select class="form-control m-b" v-model="edProj.Type" placeholder="ประเภท" @change="Projtypechange()">
		 								<option>Internal</option> 
		 								<option>External</option>                                         
		 							</select>
		 							<label>Status</label>
			 						<select class="form-control m-b" v-model="edProj.Status" placeholder="สถานะ" >
			 							<option v-for="option in pstatus[ty]">{{option}}</option> 
			 						</select>
			 					</div>
		 					</div>
							<hr>
							<div class="row">
								<div class="col-sm-6" />
								<div class="col-sm-3" />
								<div class="col-sm-3">
									<a href="#editproject" data-toggle="modal" class="btn btn-sm btn-primary pull-right m-t-n-xs" @click="Updateproj(edProj)">
										<strong>Update</strong>
									</a>  
								</div>											
							</div>
						</div>
					</div>
      </div>
  </div>
  <div id="addproject" class="modal fade" >
      <div class="modal-dialog">
        <div class="modal-content">
		 				<div class="modal-body">
		 					<div class="row">
		 						<div class="form-group">
		 							<label>Project Name</label> <input type="string" v-model="addProj.Name" placeholder="ชื่อโครงการ"  class="form-control">
		 							<label>Project Description</label> <textarea type="string" rows="5" v-model="addProj.Desc" placeholder="รายละเอียดโครงการ"  class="form-control" />
		 							<label>Type</label>
		 							<select class="form-control m-b" v-model="addProj.Type" placeholder="ประเภท" @change="Projtypechange()">
		 								<option>Internal</option> 
		 								<option>External</option>                                         
		 							</select>
		 							<label>Status</label>
			 						<select class="form-control m-b" v-model="addProj.Status" placeholder="สถานะ" >
			 							<option v-for="option in pstatus[ty]">{{option}}</option> 
			 						</select>
			 					</div>
		 					</div>
							<hr>
							<div class="row">
								<div class="col-sm-6" />
								<div class="col-sm-3" />
								<div class="col-sm-3">
									<a href="#addproject" data-toggle="modal" class="btn btn-sm btn-primary pull-right m-t-n-xs" @click="Addproj(addProj)">
										<strong>add Project</strong>
									</a>  
								</div>											
							</div>
						</div>
					</div>
      </div>
  </div>
</div>
	`,
	data: function () {
	   return {
		list: null,
		ProjectList:[],
		addProj:{Type:'External'},
		edProj:{Type:'External'},
		ty:0,
		pstatus:[
			['Open','Progress','Win','Lost','Cancel'],
			['Open','Progress','Cancel'] 
		]
	   }
	 },
	 methods: {
		Addproj:function(Proj){
			//var API = window.API
			var API_Add_proj = this.source+'/api/projects'
			var UID = this.uid
			Proj.modify_date = Date.now()
			Proj.Create_date = Date.now()
			Proj.UID = this.uid
			if(this.edProj.Type=="External"){
			  this.ty=0
			}else {this.ty=1}
			this.$http.post(API_Add_proj,Proj).then((response) => {
		   location.reload()
			  this.addProj= {}
			}, (response) => {
			  //error
			  alert(response.body.error.message)
			});
		  },
		  Updateproj:function(Proj){
			var API = window.API
			var API_Update_By_Proj_Id = this.source + '/api/projects/' + Proj.id
			Proj.modify_date = Date.now()
			this.$http.put(API_Update_By_Proj_Id,Proj).then((response) => {
					//success
			  //alert('Update:'+ response.body.Job_Header+'On'+response.body.modify_date)
			  this.getProject();
			  this.edProj= {}
			  }, (response) => {
			  //error
			  alert(response.body.error.message)
			  });
		  },
		  ProjEdit:function(thisProject){
			this.edProj=thisProject
			if(this.edProj.Type=="External"){
			  this.ty=0
			}else {this.ty=1}
		  },
		  Projtypechange: function(){
			if(this.edProj.Type=="External"){
			  this.ty=0
			}else {this.ty=1}
		  },
		  getProject : function () {        
			var API = window.API
			var UID = this.uid
			var API_Project_by_UID = this.source + '/api/projects' + '?filter[where][UID]='+UID+'&filter[order]=id%20DESC'
			this.$http.get(API_Project_by_UID).then((response) => {
			  //success
			  this.ProjectList = response.body
			}, (response) => {
			  //error
			  alert(response.body.error.message)
			});
			 
		  }
	  },
	  created: function () {
		  this.getProject();
	  },
	  mounted: function () {
		
	  }
   })

/*====================================================================================================*/
Vue.component('calendar', { 
	props: ['source','title','events','accountname','uid'],
	template: `
	<div class="row">
	<div class="col-lg-12">
		<div class="ibox float-e-margins">
			<div class="ibox-title">
				<h5>{{title}} </h5>
				<div class="ibox-tools">
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
						{{title}} Table
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
							<td>{{ props.item.subject }}</td>
							<td class="text-xs-left">{{ props.item.body.content.substring(0, 60) }}</td>
							<td class="text-xs-right">{{ props.item.start.dateTime | formatDateTz}}</td>
							<td class="text-xs-right">{{ props.item.end.dateTime | formatDateTz }}</td>
							<td class="text-xs-right"><date-cal :st="props.item.start.dateTime" :ed = "props.item.end.dateTime"></date-cal></td>
							<td class="text-xs-right">
							<a type="button" href="#Add-Model" data-toggle="modal" class="btn btn-info " @click="add(props.item)">
								<i class="fa fa-pencil-square-o"></i> Add 
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
	<!-- ---------------------------------Add Model-------------------------------------------- -->
			<div id="Add-Model" class="modal fade" aria-hidden="true">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-body">
								<div class="row">
									<center> 
										<p>Add New Task ({{newTask.Job_Hours}}) Hours</p>
										
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
													<option v-for="option in edSOW" :value="option.Name"> {{option.Name}}</option>
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
		   list: [],
		   search: '',
		   headers: [
			   { text: 'Subject',sortable: true,class: 'col-md-4',value:'subject'},
			   { text: 'Body', class: 'col-md-4', sortable: false,value:'body'},
			   { text: 'Start', align: 'right',class: 'col-md-2',sortable: false,value:'st'},
			   { text: 'End', align: 'right', class: 'col-md-2',sortable: false,value:'ed'},
			   { text: 'Hours', align: 'right', sortable: true,value:'h'},
			   { text: 'Action', align: 'center', sortable: false,value:'action'}
			 ],
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
			edSOW:{},
			edProj:{}
	//
	   }
	 },
	 methods: {
		 add: function(item){
			 this.newTask.Job_Header = item.subject
			 this.newTask.Job_detail = item.body.content
			 this.newTask.Job_Hours = moment(item.end.dateTime).diff(moment(item.start.dateTime),'hours');
			 this.newTask.Job_date = moment(item.end.dateTime).format("YYYY-MM-DD");
			 
			 /*
			   this.$http.get(this.source).then(function(response){
				   this.list = response.data;
			   }, function(error){
				   console.log(error.statusText);
			   });*/
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
		  AddNewTask : function (myTimesheet){
			var API = this.source + '/api/timesheets'
			var API_AddNewTask = API
			//this.newTask.Name_Surname = this.accountname;
			//this.newTask.UID = this.uid;
			//myTimesheet.modify_date = Date.now()
			//this.newTask.Job_Hours = this.edSOW.filter(list => list.Name == this.newTask.Job_SOW )[0].Hours
			this.$http.post(API_AddNewTask,this.newTask).then((response) => {
				  //success
				// alert('Add:'+ response.body.Job_Header+'On'+response.body.modify_date)
				this.gettimesheet();
				this.newTask= {}
				}, (response) => {
				//error
				alert(response.body.error.message)
				});
			}
	   },
	   mounted: function () {
		   this.list=JSON.parse(this.events)
		   this.newTask.Name_Surname= this.accountname;
		   this.newTask.UID= this.uid
		   this.getadJobType();
		   this.getadTech();
		   this.getadBand();
		   this.getProject();
	   }
   })
/*====================================================================================================*/
Vue.component('date-cal', { 
	props: ['st','ed'],
	template: `<span> {{data}} </span>`,
	data: function () {
	    return {
	    	data: 0
		}
	},
	mounted: function () {
		this.data = moment(this.ed).diff(moment(this.st),'hours');
	}
	
});
/*====================================================================================================*/
Vue.component('date-span', { 
	 props: ['date'],
	 template: '<span> {{date | formatDate}} </span>'
});
/*====================================================================================================*/
Vue.component('time-span', { 
	props: ['date'],
	template: '<span> {{date | formattime}} </span>'
});
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
							<a type="button" href="#Add-Model"  data-toggle="modal" @click="clickNewTask()">
							&nbsp; <i class="fa fa-paste"></i>
								<span>&nbsp; New Task</span> &nbsp; 
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
									<td class="text-xs-left col-md-4">{{props.item.Job_Header.substring(0, 60)}}<span v-if="props.item.Job_Header.length>65"> >...</span> </td>
									<td class="text-xs-left col-md-4">{{props.item.Job_detail.substring(0, 60)}}<span v-if="props.item.Job_detail.length>65"> >...</span> </td>
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
										<p>Add New Task</p>
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
				{ text: 'iD',sortable: true,  value: 'id'},
				{ text: 'Name', align: 'left', class:'col-md-4', sortable: false, value: 'Job_Header' },
				{ text: 'Detail', align: 'left',class:'col-md-4',sortable: false, value: 'Job_detail' },
				{ text: 'Hours', align: 'right',sortable: false, value: 'Job_Hours' },
				{ text: 'Deadline', align: 'right', sortable: true,value: 'Job_date' },
				{ text: 'Action', align: 'right', sortable: false, value: 'action' }
			  ]
			
	    }
	  },
	  methods: {
		  gettimesheet: function(){
			//var Mydata;
			const reqapi = this.source + '/api/timesheets'
			var api = reqapi + '?filter[where][Name_Surname]='+ this.accountname
			var api = api + '&filter[where][create_date][gt]=2018-01&filter[where][Job_date][gt]=2018-01'
			var api = api + '&filter[order]=id%20DESC&filter[limit]=100'
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
			this.newTask.create_date = Date.now();
			this.newTask.Completed_date = Date.now();
			this.newTask.Job_progress = 100;
			this.newTask.Job_status = "Completed";
			this.newTask.modify_date= Date.now();
			
			//myTimesheet.modify_date = Date.now()
			/*
			"create_date": Date.now(),
				"Job_date": Date.now(),
				"modify_date": Date.now(),
				"Job_progress": 100,
				"Job_status": "Completed",
				"Completed_date": Date.now()*/
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
/*====================================================================================================*/

Vue.use(VueResource);

var app = new Vue().$mount('#wrapper')