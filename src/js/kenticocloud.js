var Kc = window['kenticoCloudDelivery'];
// change your project ID here
//
//

var deliveryClient = new Kc.DeliveryClient({
   projectId: 'e613d152-b10b-0146-c5a2-6209746abb64'
});

//
//
//
//


Vue.component('navigation', {
	template: `
		<nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
			<div class="container">
			  <a class="navbar-brand js-scroll-trigger" href="#page-top">Start Bootstrap</a>
			  <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
				Menu
				<i class="fas fa-bars"></i>
			  </button>
			  <div class="collapse navbar-collapse" id="navbarResponsive">
				<ul class="navbar-nav ml-auto">
				  <li class="nav-item">
					<a class="nav-link js-scroll-trigger" href="#about">About</a>
				  </li>
				  <li class="nav-item">
					<a class="nav-link js-scroll-trigger" href="#projects">Projects</a>
				  </li>
				  <li class="nav-item">
					<a class="nav-link js-scroll-trigger" href="#signup">Contact</a>
				  </li>
				</ul>
			  </div>
			</div>
		</nav>
 `
 });
 
 // get content from Kentico Cloud
 // process that content -> own models
 // display data

 Vue.component('teaser', {
	data: function(){
		return {
			header: null,
			content: null,
			buttonLink: null,
			buttonText: null
		}
	},
	mounted: function () {
		deliveryClient
			.items()
			.type('teaser')
			.getPromise()
			.then(response => {
				let item = response.items[0].elements;
				this.$data.header = item.header.value;
				this.$data.content = item.content.value;
				this.$data.buttonLink = item.button_link.value;
				this.$data.buttonText = item.button_text.value;
			});
    },
	
	template: `
		<header class="masthead">
			<div class="container d-flex h-100 align-items-center">
			  <div class="mx-auto text-center">
				<h1 class="mx-auto my-0 text-uppercase">{{header}}</h1>
				<h2 class="text-white-50 mx-auto mt-2 mb-5">{{content}}</h2>
				<a :href="buttonLink" class="btn btn-primary js-scroll-trigger">{{buttonText}}</a>
			  </div>
			</div>
		</header>`
 });
 
 Vue.component('main-content', {
	data: function(){
		return {
			header: null,
			content: null,
			imageUrl: null,
			imageAlt: null
		}
	},
	mounted: function () {
		deliveryClient
			.items()
			.type('main_content')
			.getPromise()
			.then(response => {
				let item = response.items[0].elements;
				this.$data.header = item.header.value;
				this.$data.content = item.content.value;
				this.$data.imageUrl = item.image.value[0].url;
				this.$data.imageAlt = item.image.value[0].description;
			});
    },
	template: `
		<section id="about" class="about-section text-center">
			<div class="container">
			  <div class="row">
				<div class="col-lg-8 mx-auto">
				  <h2 class="text-white mb-4">{{header}}</h2>
				  <div class="text-white-50" v-html="content"></div>
				</div>
			  </div>
			  <img :src="imageUrl" class="img-fluid" :alt="imageAlt">
			</div>
		 </section>` 
 });

 Vue.component('articles', {
	data: function(){
		return {
			articles: []
		};
	},
	mounted: function () {
		deliveryClient
			.items()
			.type('article')
			.getPromise()
			.then(response => {
				this.$data.articles = response.items.map((item) => ({
					id: item.system.id,
					header: item.elements.header.value,
					content: item.elements.content.value,
					imageUrl: item.elements.image.value[0].url,
					imageAlt: item.elements.image.value[0].description
				}));
				
			});
    },
	template: `
	<section id="projects" class="projects-section bg-light">
		<div class="container">
			<articleItem v-for="(article, index) in articles" :key="article.id" :data="article" :featuredArticle="index === 0" :left="index%2===1"></articleItem>
		</div>
	 </section>`	
 });
 
 Vue.component('articleItem', {
	 props: ['data', 'featuredArticle', 'left'],
	 template: `
		<div>
			<!-- Featured Project Row -->
			<div class="row align-items-center no-gutters mb-4 mb-lg-5" v-if="featuredArticle">
				<div class="col-xl-8 col-lg-7">
				  <img class="img-fluid mb-3 mb-lg-0" :src="data.imageUrl" :alt="data.imageAlt">
				</div>
				<div class="col-xl-4 col-lg-5">
				  <div class="featured-text text-center text-lg-left">
					<h4>{{data.header}}</h4>
					<div class="text-black-50 mb-0" v-html="data.content"></div>
				  </div>
				</div>
			</div>
			
			<!-- Project One Row -->
			<div :class="'row justify-content-center no-gutters ' + (left ? 'mb-5 mb-lg-0' : '')" v-else>
				<div class="col-lg-6">
				  <img class="img-fluid" :src="data.imageUrl" :alt="data.imageAlt">
				</div>
				<div :class="'col-lg-6 ' + (left ? '' : 'order-lg-first')">
				  <div class="bg-black text-center h-100 project">
					<div class="d-flex h-100">
					  <div :class="'project-text w-100 my-auto text-center ' + (left ? 'text-lg-left' : 'text-lg-right')">
						<h4 class="text-white">{{data.header}}</h4>
						<div class="mb-0 text-white-50" v-html="data.content"></div>
						<hr :class="'d-none d-lg-block mb-0 ' + (left ? 'ml-0' : 'mr-0')">
					  </div>
					</div>
				  </div>
				</div>
			</div>
		</div>`
 });

const app = new Vue({
 el: '#vue-app'
});
