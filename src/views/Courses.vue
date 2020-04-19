<template>
 <div id="courses">
    
    <Status class="StatusShow" v-bind:img="status" v-show="loading" />

    <section id="banner" class="banner" v-for="item in data" :key="item.fields.Title">
        <div class="content" >
            <header>
                <h2>{{ item.fields.Title }}</h2>
            </header>
                <p>{{ item.fields.ShortDescription }}</p>
                <h5>ECTS: {{ item.fields.ECTS }} </h5>         
            <ul class="actions">
                <li><a href="#" class="button big">Learn More</a></li>
            </ul>
        </div>
        <span class="image object">
            <img v-bind:src="item.fields.Visuals[0].url" v-bind:alt="item.fields.Title" />
        </span>
    </section>
    <section class="banner">
    <div id="pages" style="text-align:center" v-show="ready">
        <p><button  :disabled='backDisabled' v-on:click="backward">previous page</button> | <button  :disabled='forwardDisabled' v-on:click="forward">next page</button></p>
    </div>
    </section>
</div>
</template>


<style >

</style>

<script>
import axios from 'axios';
import Status from '@/components/Status.vue'

async function getData(viewStatus)
{

    const config = 
    {
        headers: 
        {
        
        
        }
    }
var settings = {
    'table': viewStatus.table,
    'pageSize': viewStatus.pageSize,
    'offset': viewStatus.offset,
    'fields': ['Title','ShortDescription', 'Visuals','ECTS']
}
//alert(JSON.stringify(settings));
const formData = new FormData();
formData.append('data', JSON.stringify(settings));
formData.append('action', 'view');

viewStatus.loading = true;
await axios.post (viewStatus.$baseUrl, formData, config)
        .then(response => 
        {
            viewStatus.data = response.data.records;
            //alert(JSON.stringify(response.data));
            if(response.data.offset)
            {
                viewStatus.offset = response.data.offset;
                viewStatus.ready = true;
            }
            else
            {
                viewStatus.offset = "";
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
    name: "courses",
    components: {Status},

    data() 
    {
    return {
        data: null,
        ready: false,
        loading: false,
        status: "",
        offset: "",
        offsetHistoryCursor: 0,
        pageSize: 2,
        offsetHistory: [],  
        table: "Course"
        }
    },
    methods:
    {
        forward: function() 
        {
            this.offsetHistoryCursor++;
            this.offsetHistory[this.offsetHistoryCursor] = this.offset;
            getData(this);
           
        },
        backward: function()
        {
            this.offsetHistoryCursor--;
            if(this.offsetHistoryCursor < 0) this.offsetHistoryCursor =0;
            this.offset = this.offsetHistory[this.offsetHistoryCursor];
            getData(this);
        }
    },
    computed: {
  	    backDisabled: function(){
              if(this.offsetHistoryCursor == 0)
                return true;
                else
    	        return false;
        },
        forwardDisabled: function(){
           // if(this.offset)
    	    return  (this.offsetHistoryCursor >0 || this.offsetHistoryCursor ==0) && this.offset == "";
        }  
  },
    created() 
    {
        this.offsetHistory[0]="";
        getData(this);
    },
}


</script>


