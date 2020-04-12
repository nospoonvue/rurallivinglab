<template>
 <div id="blog">

              <div id="statuslog" class="Absolute-Center"><img id="statusimage" v-bind:src="status" /> </div>


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
            <img v-bind:src="item.fields.Photos[0].url" alt="" />
        </span>
    </section>
</div>
</template>


<style >
.Absolute-Center {
  margin: auto;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  width: 256px;
  height: 256px;
 
  
}
</style>

<script>
import axios from 'axios';
import BlogListing from '@/components/BlogListing.vue'

const baseUrl = `https://script.google.com/macros/s/AKfycbxdxAaP33kUP1kO0J4TOHKdz6FMoiIVPCqQvrGaoNfrWbAeJiY/exec`;

async function getData(viewStatus)
{
    viewStatus.status = "./images/loading.gif";
     await axios.get (baseUrl, {})
            .then(response => 
            {
                 viewStatus.info = response.data.records;
                 viewStatus.status = "";
                // alert(response.data.records[0].fields);

            }).catch
            (
                function (error) 
                {
                    console.log(error)
                    viewStatus.status = error;
                }
            )
}

export default 
{
    name: "projects",
    components: {BlogListing},

    data() 
    {
    return {
        info: null,
        status: ""
        }
    },
    created() 
    {
        this.status = "loading...";
        getData(this);
    },
}


</script>


