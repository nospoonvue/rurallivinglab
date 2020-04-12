<template>
 <div id="blog">
 
    <section id="banner" v-for="item in info" :key="item.fields">
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

<script>
import axios from 'axios';
import BlogListing from '@/components/BlogListing.vue'
//AKfycbycd1UTMGwmjzS3oUcsKyQ0Kc273H_w4T8PmeRXPMwhjEVsU
const baseUrl = `https://script.google.com/macros/s/AKfycbxdxAaP33kUP1kO0J4TOHKdz6FMoiIVPCqQvrGaoNfrWbAeJiY/exec`;

async function getData(viewStatus)
{
     await axios.get (baseUrl, {})
            .then(response => 
            {
                 viewStatus.info = response.data.records;
                 viewStatus.status = "done";
                 alert(response.data.records[0].fields);

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



