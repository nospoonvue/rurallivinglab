<template>
 <div id="login">
    <section id="banner" class="banner">

        <div class="content" v-if="user && user.Token && !signUp">
            <h1>Profile</h1>
            <p><input type="text" name="loggedInName" id="loggedInName" value="" placeholder="Name" v-model="user.Username"></p>
            <p><input type="text" name="loggedInName" id="loggedInName" value="" placeholder="First name" v-model="user.Name"></p>
            <p><input type="text" name="loggedInLastName" id="loggedInLastName" value="" placeholder="Last name" v-model="user.LastName"></p>
            <p><input type="Logout" value="Log out" class="button big" v-on:click="logOut()"></p>
        </div>

        <div class="content" v-if="!user || !user.Token && !signUp">

                <h1>Login</h1>
                <p><input type="text" name="loginName" id="loginName" value="" placeholder="Username" v-model="user.Username"></p>
                <p><input type="password" name="Password" id="Password" value="" placeholder="Password" v-model="user.Password"></p>
                <ul class="actions">
                    <li><a href="#" class="button primary" v-on:click="getLogin()">Login</a></li>
                    <li><a href="#" class="button" v-on:click="applyForAccount()">Sign up</a></li>
                </ul>
        </div>

        <div class="content" v-if="signUp">

                <h1>Sign up</h1>
                <p><input type="text" name="loginName" id="loginName" value="" placeholder="Username" v-model="user.Username"></p>
                <p><input type="text" name="loggedInName" id="loggedInName" value="" placeholder="First name" v-model="user.Name"></p>
                <p><input type="text" name="loggedInLastName" id="loggedInLastName" value="" placeholder="Last name" v-model="user.LastName"></p>
                
                <p><input type="password" name="Password" id="Password" value="" placeholder="Password" v-model="user.Password"></p>
                <p><input type="email" name="Email" id="email" value="" placeholder="E-mail" v-model="user.Email"></p>
                <ul class="actions">
                    <li><a href="#" class="button primary" v-on:click="getAccount()">Sign up</a></li>
                    <li><a href="#" class="button" v-on:click="signUp=false">Login</a></li>
                </ul>
                
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



async function getData(viewStatus,action)
{

    viewStatus.statuscss = "StatusShow";

    const config = 
    {
        headers: 
        {
        }
    }

    const formData = new FormData();
    formData.append('action', action);
    formData.append('data', JSON.stringify(viewStatus.user));

    //alert(JSON.stringify(JSON.stringify(viewStatus.user)));

    await axios.post (baseUrl, formData, config)
            .then(response => 
            {
                //alert(baseUrl);
                viewStatus.data = response.data.records;
                viewStatus.statuscss = "StatusHidden";
                //alert('response:'+JSON.stringify(response));
 
                if(viewStatus.data && viewStatus.data.length>0)
                {
                    //update local and global scope
                    viewStatus.user = viewStatus.data[0].fields;
                    viewStatus.$user = viewStatus.user;
                   
                    //store in browser
                    sessionStorage.user = JSON.stringify(viewStatus.user)
                    localStorage.user = JSON.stringify(viewStatus.user)
                    //update login/profile label
                    document.getElementById('un').innerHTML = viewStatus.user.Name;
                }
                else
                {
                    alert('Login failed');
                    document.getElementById('un').innerHTML = "Login";
                }

            }).catch
            (
                function (error) 
                {
                    console.log(error);
                    alert(error);
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
        signUp: false,
        table: "User",
        user: {}
        }
    },
    methods:
    {
        getLogin: function()
        {
            //alert('getlogin');
            getData(this, 'login');
        },
        logOut: function()
        {
            this.user = {};
            this.$user = {};
            sessionStorage.user = {};
            localStorage.user = {};
            document.getElementById('un').innerHTML = "Log in";
        },
        applyForAccount: function()
        {
            this.signUp = true;
            
        },
        getAccount: function()
        {
            getData(this, 'create');
        }
    },
    computed: {

  },
  
    created() 
    {
        //alert("global user:"+ this.$user);
        if(this.$user)
        {
            this.user = this.$user;
            document.getElementById('un').innerHTML = this.user.Name;
        }
        else
        {
            //alert('leeg in login');
            this.user = {};
        }
    }
}


</script>


