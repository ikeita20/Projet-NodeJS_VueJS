

window.onload = function () {
    let addarticle = {
        props: {
        },

        data : function () {
            return {
                article : {
                    title : "",
                    content : ""
                },
                result : {}
            }
        },
        methods: {
            enregistrer: function () {
                axios({
                    method: 'get',
                    url: 'https://api.coindesk.com/v1/bpi/currentprice.json',

                }).then(response => (this.result = response))


            }
        },

        template: `
             <form  @submit.prevent="enregistrer">
                  <div class="form-group">
                    <label for="tile">Titre de l'article</label>
                    <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="title" placeholder="Donnez le titre de l'article" required v-model="article.title">
                  </div>
                  <div class="form-group">
                    <label for="content">Contenu</label>
                    <textarea  class="form-control" id="content" placeholder="content of article" required v-model="article.content"/>
                  </div>
   
                  <button type="submit" class="btn btn-primary">Ajouter</button>
            </form>
        `,

    } ;


    var controlleur = new Vue({
        el: '#app',

        components: { addarticle } ,

        data: {
            isHiddenAddArticleForm: false,
            articles : {},
        },

        methods: {

            ajouterArticle: function() {
               this.isHiddenAddArticleForm = true
            },

            monmessage: function() {
                console.log('lemessage')
            },

            ajouterPoubelle: function (index) {

                this.poubelle.push( this.personnes[index] );
                this.personnes.splice(index, 1);

            },

            restaurer: function (index) {
                this.personnes.push( this.poubelle[index] );
                this.poubelle.splice(index, 1);
            },

            supprimer: function (index) {
                this.poubelle.splice(index, 1)

            },

            fermer: function () {
                this.success = false;
            },

        },


    });


}
