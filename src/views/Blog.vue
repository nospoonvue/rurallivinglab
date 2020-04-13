<template>
 <div id="blog">
    
    <Status v-bind:class="statuscss" v-bind:img="status"/>

    <section id="banner" class="banner" v-for="item in info" :key="item.fields.Title">
        <div class="content" >
            <header>
                <h1>{{ item.fields.Title }}</h1>
                <p>{{ item.fields.Subtitle }}</p>
                <h5>{{ item.fields.PublishDate }} </h5>
            </header>
            <p>{{ item.fields.Article }}</p>
            <ul class="actions">
                <li><a href="#" class="button big">Learn More</a></li>
            </ul>
        </div>
        <span class="image object">
            <img v-bind:src="item.fields.Photos[0].url" v-bind:alt="item.fields.Title" />
        </span>
    </section>
    <section class="banner">
    <div id="pages" style="text-align:center">
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

var baseUrl = `https://script.google.com/macros/s/AKfycbxdxAaP33kUP1kO0J4TOHKdz6FMoiIVPCqQvrGaoNfrWbAeJiY/exec`;


async function getData(viewStatus)
{

    viewStatus.statuscss = "StatusShow";

    //baseUrl += '?pageSize=' + viewStatus.pageSize;
    //baseUrl += '&offset=' + viewStatus.offset;
    //alert(baseUrl);
    await axios.get (baseUrl + '?table=' +viewStatus.table + '&pageSize=' + viewStatus.pageSize + '&offset=' + viewStatus.offset, {})
            .then(response => 
            {
                viewStatus.info = response.data.records;
                viewStatus.statuscss = "StatusHidden";
                if(response.data.offset)
                {
                    viewStatus.offset = response.data.offset;
                   // alert(response.data.offset);
                }
                else
                {
                    viewStatus.offset = "";
                    
                }

            }).catch
            (
                function (error) 
                {
                    console.log(error)
                    //viewStatus.status = error;
                }
            )
}

export default 
{
    name: "projects",
    components: {Status},

    data() 
    {
    return {
        info: null,
        statuscss: "StatusHidden",
        status: "",
        offset: "",
        offsetHistoryCursor: 0,
        pageSize: 10,
        offsetHistory: [],  
        table: "Blog"
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


