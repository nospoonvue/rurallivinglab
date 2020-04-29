<template>
    <div id="course">
        <Status class="StatusShow" v-bind:img="status" v-show="loading" />
        <section>

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

        <h2>Sections</h2>
            <div class="" v-for="section in sections" :key="section.fields.Title" >
                <h3>{{section.fields.Order}}. {{section.fields.Title}}</h3>
                <div v-if="track || !user ">
                <div  class="" v-for="subject in filteredSubjects(section)" :key="subject.fields.Title"  >
                    <input type="radio" :id="subject.id" :name="subject.id" :checked="getStudentTrack(subject)" >
                    <label :for="subject.id">{{subject.fields.Title}}</label>
                
                </div>
                </div>
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
           
          //  alert(settings.bind);
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
                    'fields': ['Title', 'Order', 'Description', 'Visuals'],
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
                    'fields': ['Title','Description', 'Visuals', 'Section'],
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
                    //alert("studentTrackkkk:"+JSON.stringify(response));
                    viewStatus.track = response.data.records[0];
                    break;

                default:
                    break;

            }


            
  
            viewStatus.loading = false;
    
            
           // alert(config.bind.Title)
           // objectToLoad = JSON.parse(response.data.records[0].fields);
           

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
        track: null
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