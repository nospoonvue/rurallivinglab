<template>
 <div id="login">
    <section id="banner" class="banner">
        <div class="content" v-if="user && user.Token">
            <h1>Profile</h1>
            <p><input type="text" name="loggedInName" id="loggedInName" value="" placeholder="Name" v-model="user.Name"></p>
             <p><input type="text" name="loggedInLastName" id="loggedInLastName" value="" placeholder="Last name" v-model="user.LastName"></p>
            <p><input type="Logout" value="Log out" class="button big" v-on:click="logOut()"></p>
        </div>

        <div class="content" v-if="!user || !user.Token">

                <h1>Login</h1>
                <p><input type="text" name="loginName" id="loginName" value="" placeholder="Login" v-model="user.name"></p>
                <p><input type="password" name="Password" id="Password" value="" placeholder="Password" v-model="user.password"></p>
                <p><input type="Login" value="Login" class="button big" v-on:click="getLogin()"></p>
        </div>


        <span class="image object">
         
        </span>
    </section>
 <Status v-bind:class="statuscss" v-bind:img="status"/>
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

    const config = 
    {
        headers: 
        {
    
    
        }
    }

    const formData = new FormData();
    formData.append('action', 'login');
    formData.append('username', viewStatus.user.name);
    formData.append('password', viewStatus.user.password);

    await axios.post (baseUrl, formData, config)
            .then(response => 
            {
                //alert('hi');
                viewStatus.data = response.data.records;
                viewStatus.statuscss = "StatusHidden";

 
                if(viewStatus.data.length>0)
                {
                    //alert(viewStatus.data[0].fields);
                    viewStatus.user = viewStatus.data[0].fields;
                    //alert("in"+JSON.stringify(viewStatus.user));
                    sessionStorage.user = JSON.stringify(viewStatus.user)
                    localStorage.user = JSON.stringify(viewStatus.user)
                    document.getElementById('un').innerHTML = viewStatus.user.Name;
                }
                else
                {
                    alert('login failed');
                    //this.logOut();
                }

                
               

            }).catch
            (
                function (error) 
                {
                    console.log(error)
                    //viewStatus.status =error;
                }
            )
            
}

export default 
{
    name: "login",
    components: {Status},

    data() 
    {
    return {
        data: null,
        statuscss: "StatusHidden",
        status: "",
        table: "User",
        user: {}
        }
    },
    methods:
    {
        getLogin: function()
        {
            getData(this);
            //set header right
            //document.getElementById('un').innerHTML = this.user.Name;
        },
        logOut: function()
        {
            this.user = {};
            sessionStorage.user = {};
            localStorage.user = {};
            document.getElementById('un').innerHTML = "Log in";
        }
    },
    computed: {

  },
  
    created() 
    {
        if(localStorage.user) 
        {
            this.user = JSON.parse(localStorage.user);
            document.getElementById('un').innerHTML = this.user.Name;
           // alert("back:"+ this.user.Name);
        }
        else
            this.user = {};
    //    getData(this);
    }
}


</script>


