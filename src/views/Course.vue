<template>
    <div id="course">
        <Status class="StatusShow" v-bind:img="status" v-show="loading" />
        <section  v-if="!selectedSection && !selectedSubject && showCourseInfo">
        
        <span class="image main">
            <div class="" v-for="item in filterImages" :key="item.Title" >
                <img v-bind:src="item.url" v-bind:alt="item.Title" />
            </div>
            
        </span>
        <h1>{{course.Title}}</h1>
        <blockquote>{{course.ShortDescription}}</blockquote>

        <h3>Description</h3>
        <p>{{course.FullDescription}}<p/>
        <hr class="major" />
    </section>

    <section id="banner" class="banner">
        <span class="object" style="width:300px;" >
            <ul style="list-style: none;padding-left: 0.2em;text-align: center;" class="" v-if="!showCourseInfo" v-on:click="showCourseInfo=true;selectedSection = null;selectedSubject=null">
                <li id="backding"><a href="#" class="button small">Back to course overview</a></li>
            </ul>
            
            <h2>Sections</h2>
            <div class="" v-for="section in sections" :key="section.fields.Title" >
                
                <div v-on:click="toggleSection(section)" style="cursor: pointer;display: inline-block;"> <h3 style="display: inline-block;" ><i  :id="'arrow'+section.id" class="fa fa-angle-double-down"></i> {{section.fields.Order}}. {{section.fields.Title}} ({{section.fields.NumberOfSubjectsFinished}}/{{section.fields.NumberOfSubjects}})</h3></div>
                <div  :id="section.id" style="display:none">
               
                <div v-if="track || !user " >
                <div  class="" v-for="subject in filteredSubjects(section)" :key="subject.fields.Title"  v-on:click="loadFullSubject(subject)">
                    <input type="radio" :id="subject.id" :name="subject.id" :checked="getStudentTrack(subject)" @click.prevent >
                    <label :for="subject.id" @click.prevent >{{subject.fields.Title}}</label>
                </div>
                </div>
                </div>
            </div>
        </span>

        <div class="content" v-if="selectedSection && !selectedSubject" >
            <header>
                <h1>Section: {{ selectedSection.fields.Title }}</h1>
                <p><vue-markdown :source="selectedSection.fields.Description"></vue-markdown></p>    
            </header>
        </div>

        <div class="content" v-if="selectedSubject" >
            <header>
                <h1>Subject: {{ selectedSubject.fields.Title }}</h1>
                <p><vue-markdown :source="selectedSubject.fields.Description"></vue-markdown></p>    
              
            </header>

            <ul class="actions">
                <li><a href="#" class="button small" v-on:click="nextSubject(selectedSubject,false)" >Next subject</a><a href="#" class="button small" v-on:click="nextSubject(selectedSubject, true)" >Finish subject</a></li>
            </ul>
        </div>


         </section>
    </div>
</template>

<style >

</style>

<script>
import axios from 'axios';
import Status from '@/components/Status.vue'
import VueMarkdown from 'vue-markdown'
import { VueAgile } from 'vue-agile'

//default
var settings = {};

async function getData(viewStatus)
{
        const config = 
    {
        headers: 
        {
        
        
        }
    }

//alert(JSON.stringify(settings));
const formData = new FormData();
formData.append('data', JSON.stringify(settings));
formData.append('action', 'view');

viewStatus.loading = true;
await axios.post (viewStatus.$baseUrl, formData, config)
        .then(response => 
        {            
            //alert(JSON.stringify(response.data.records[0]));           
            //alert(settings.bind);
            switch (settings.bind) 
            {
                case 'course':
                   // alert(response.data.records[0].id);
                    // set course
                    viewStatus.recordId = response.data.records[0].id;
                    viewStatus.course = response.data.records[0].fields;
                    viewStatus.courseName = response.data.records[0].fields.Title;
                    // get Subjects
                    settings = 
                    {
                    'table': 'Section',
                    'view': 'Main',
                    'fields': ['Order','Title', 'Description', 'Order', 'Description', 'Visuals', 'NumberOfSubjects','NumberOfSubjectsFinished'],
                    'filter': '{Course}="'+ viewStatus.courseName + '"',
                    'bind': 'section'
                    };
                    getData(viewStatus);
                    
                    break;

                case 'section':
                  //  alert("sections:"+JSON.stringify(response));
                    viewStatus.sections = response.data.records;

                    // get sections
                    settings = 
                    {
                    'table': 'Subject',
                    'view': 'Main',
                    'fields': ['Order','Title','Description', 'Visuals', 'Section'],
                    'filter': '{Course}="'+ viewStatus.courseName + '"',
                    'bind': 'subject'
                    };
                    getData(viewStatus);
                    // get subjects
                    break;

                case 'subject':
                  //  alert("subjects:"+JSON.stringify(response));
                    viewStatus.subjects = response.data.records;
                    if(!viewStatus.user)
                    {
                        break;
                    }

                    settings = 
                    {
                    'table': 'StudentTrack',
                    'view': 'Main',
                    'fields': ['Subjects'],
                    'filter': '{Token}="'+ viewStatus.user.Token + '"',
                    'bind': 'studentTrack'
                    };
                    
                    getData(viewStatus);
                    break;

                case 'studentTrack':
                    viewStatus.track = response.data.records[0];
                    
                    //how much finished sofar?
                    for(let x=0; x<viewStatus.subjects.length;x++)
                    {
                        let tsub = viewStatus.track.fields.Subjects.filter( function(sub){ return (sub==viewStatus.subjects[x].id);} );
                        if(tsub.length>0)
                        {                            
                            var tsec = viewStatus.sections.filter( function(sec){ return (sec.id==viewStatus.subjects[x].fields.Section);} );
                            if(tsec.length>0)
                            {
                                tsec[0].fields.NumberOfSubjectsFinished +=1;
                            }
                        }
                    }
                    break;
                case 'trackUpdate':
                    

                    break;
                default:
                    break;
            }

            viewStatus.loading = false;

        }).catch
        (
            function (error) 
            {
                console.log("fooout:"+error)
                //viewStatus.status = error;
                viewStatus.ready = false;
                viewStatus.loading = false;
            }
        )
}

export default 
{
    name: "course",
    components: {Status, VueMarkdown,Agile: VueAgile },

    data() 
    {
    return {
        user: null,
        objectToLoad: {},
        recordId: "",
        data: null,
        ready: false,
        loading: false,
        status: "",
        table: "Course",
        course: {},
        subjects: null,
        sections: {},
        courseName: "",
        track: null,
        selectedSubject: null,
        selectedSection: null,
        showCourseInfo: true
        }
    },
    props: 
    {
        name: 
        {
        type: String,
        default: 'Prachtig'
        }
    },
    methods:
    {
        /*
        filterImages: function (visuals) {
            return visuals.filter(function (image) {
            return  image.url.includes("736x512");  
            })
        },
        */
       loadFullSubject: function (subject)
       {
           
           this.selectedSubject = subject;
       },
       getStudentTrack: function (compareSubject)
       {
          //alert(JSON.stringify(this.track));
           if(!this.track ) return false; 


           if (this.track.fields.Subjects.filter(function (subject)
           {
               if(subject == compareSubject.id)
                    return true;
                else
                    return false; 
           }).length>0) return true
           else
           return false;


           
       },
        filteredSubjects: function (section) {
            //alert("filterding: " + JSON.stringify(this.subjects) + " ---- " + " ---- " + section.id);
            if(!this.subjects || this.subjects.length == 0)return false;
            return this.subjects.filter(function (subject) {
            return subject.fields.Section == section.id;
            })
        },
        toggleSection: function (section){
            document.getElementById('sidebar').className = "inactive";
            this.showCourseInfo= false;

            if(document.getElementById(section.id).style.display == "none")
            {
                document.getElementById(section.id).style.display = "block";
                document.getElementById('arrow'+section.id).className = "fa fa-angle-double-up";
                this.selectedSubject = null;

                if(this.selectedSection)
                {
                    document.getElementById(this.selectedSection.id).style.display = "none";
                    document.getElementById('arrow'+this.selectedSection.id).className = "fa fa-angle-double-down";
                }
                this.selectedSection = section;
                
            }   
            else
            {
                document.getElementById(section.id).style.display = "none";
                document.getElementById('arrow'+section.id).className = "fa fa-angle-double-down";
                this.selectedSection = null;
            }
        },
        nextSubject: function (selectedSubject, finishIt){
            {
                /*
                if(finishIt)
                {
                    //add subject to StudentTrack
                    settings = 
                    {
                    'table': 'StudentTrack',
                    'fields': ['Title','ShortDescription', 'FullDescription', 'Visuals','ECTS'],
                    'filter': '{LinkName}="'+ this.name + '"',
                    'bind': 'course'
                    };                    
                     getData(this);
                }
                */
                for (let thisSubject of this.subjects) 
                {
                    if(thisSubject.fields.Order === (this.selectedSubject.fields.Order+1))
                    {
                         this.selectedSubject = thisSubject; 
                         break;
                    }
                }

                if(this.selectedSubject.fields.Section != this.selectedSection.id)
                {
                    document.getElementById(this.selectedSection.id).style.display = "none";
                    document.getElementById('arrow'+this.selectedSection.id).className = "fa fa-angle-double-down";         

                    for (let thisSection of this.sections) 
                    {
                        if(thisSection.id == this.selectedSubject.fields.Section)
                        {
                            
                            this.selectedSection = thisSection;
                            document.getElementById(this.selectedSection.id).style.display = "block";
                            document.getElementById('arrow'+this.selectedSection.id).className = "fa fa-angle-double-up";                                 
                        }
                    }
                }                            
            }
        }
    },
    computed: 
    {
        filterImages: function () 
        {
           // alert(this.course.Visuals);
           if(this.course.Visuals)
           {
            return this.course.Visuals.filter(function (image) 
                {
                    return  image.url.includes("1280x416");  
                })
           }
           else
           {
               return null;
           }
        }
    },
    created() 
    {
        if(localStorage && localStorage.user)
        {
            this.user = JSON.parse(localStorage.user);
        }

        settings = 
        {
        'table': this.table,
        'pageSize': 50,
        'fields': ['Title','ShortDescription', 'FullDescription', 'Visuals','ECTS'],
        'filter': '{LinkName}="'+ this.name + '"',
        'bind': 'course'
        };
        //objectToLoad = this.course;
        //this.objectToLoad =  this.course;
        getData(this);
    },
    mounted()
    {
       // alert(this.name); 
   
    }
}


</script>