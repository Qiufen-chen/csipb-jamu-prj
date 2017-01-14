import { Component } from '@angular/core';
import { AppState } from '../app.service';

import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Http } from '@angular/http';

declare var saveAs: any;

@Component({
  selector: 'home',
  providers: [
  ],
  directives: [
  ],
  pipes: [ ],
  styleUrls: [ './home.style.css' ],
  templateUrl: './home.template.html'
})
export class Home {
  options: any;
  data: any;
  chartType: any;

  plant: any;
  compound: any;
  protein: any;
  disease: any;

  // count variable
  countTanaman = 0;
  countCompound = 0;
  countProtein = 0;
  countDisease = 0;

  // active variable
  activeTanaman = true;
  activeCompound = true;
  activeProtein = true;
  activeDisease = true;

  // show
  show = false;

  dataLocal = [];

  FileSaver: any;

  // DATA search
  plantSearch: Array<string>;
  compoundSearch: Array<string>;
  proteinSearch: Array<string>;
  diseaseSearch: Array<string>;

  plant_total;
  compound_total;
  protein_total;
  disease_total;

  selectedPlants = [];
  selectedCompounds = [];
  selectedProteins = [];
  selectedDiseases = [];

  typeaheadNoResults:boolean = false;

  noResultPlant = false;
  noResultCompound = false;
  noResultProtein = false;
  noResultDisease = false;

  pTanaman = false;
  pProtein = false;
  pCompound = false;
  pDisease = false;

  // This 3 vars are used in text output
  jsonPlantCompound;
  jsonCompoundProtein;
  jsonProteinDisease;

  click = false;
  baseAPI;

  //////////////////////////////////////////////////////////////////////////////
  ngOnInit() {

  }

  public stateCtrl:FormControl = new FormControl();

  public myForm:FormGroup = new FormGroup({
    state: this.stateCtrl
  });

  public typeaheadOnSelect(e:any):void {

  }

  public changeTypeaheadNoResults(e:boolean, id):void {
    this.typeaheadNoResults = e;

    if (id == 1) {
      this.noResultPlant = e;
    }

    else if (id == 2) {
      this.noResultCompound = e;
    }

    else if (id == 3) {
      this.noResultProtein = e;
    }

    else if (id == 4) {
      this.noResultDisease = e;
    }
  }

  constructor(public appState: AppState, private http: Http) {

    this.plant = [{ 'index': this.countTanaman, 'value' : ''}];
    this.compound = [{ 'index': this.countCompound, 'value' : ''}];
    this.protein = [{ 'index': this.countProtein, 'value' : ''}];
    this.disease = [{ 'index': this.countDisease, 'value' : ''}];

    this.http.get('http://ijah.apps.cs.ipb.ac.id/ijah/total.php')
      .map(res => res.json())
      .subscribe(data => {
        this.plant_total = data[0]['plant_total'];
        this.compound_total = data[0]['compound_total'];
        this.protein_total = data[0]['protein_total'];
        this.disease_total = data[0]['disease_total'];
      })

    this.http.get('http://ijah.apps.cs.ipb.ac.id/ijah/plant.php')
      .map(res => res.json())
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          let temp = data[i]['pla_name'];
          data[i]['search'] = temp;
        }

        this.plantSearch = data;
      })

    this.http.get('http://ijah.apps.cs.ipb.ac.id/ijah/compound.php')
      .map(res => res.json())
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          let temp = '';
          if (data[i]['com_cas_id'] !== '') {
            temp = temp+data[i]['com_cas_id']+' | ';
          }

          if (data[i]['com_drugbank_id'] !== '') {
            temp = temp+data[i]['com_drugbank_id']+' | ';
          }

          if (data[i]['com_knapsack_id'] !== '') {
            temp = temp+data[i]['com_knapsack_id']+' | ';
          }

          if (data[i]['com_kegg_id'] !== '') {
            temp = temp+data[i]['com_kegg_id']+' | ';
          }

          if (data[i]['com_pubchem_id'] !== '') {
            temp = temp+data[i]['com_pubchem_id'];
          }

          data[i]['search'] = temp;
        }

        this.compoundSearch = data;
      })

    this.http.get('http://ijah.apps.cs.ipb.ac.id/ijah/protein.php')
      .map(res => res.json())
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          let temp = data[i]['pro_uniprot_id']+' | '+data[i]['pro_name'];
          data[i]['search'] = temp;
        }

        this.proteinSearch = data;
      })

    this.http.get('http://ijah.apps.cs.ipb.ac.id/ijah/disease.php')
      .map(res => res.json())
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          let temp = data[i]['dis_omim_id']+' | '+data[i]['dis_name'];
          data[i]['search'] = temp;
        }

        this.diseaseSearch = data;
      })

      this.baseAPI ='http://localhost/';
  }

  // INPUT HANDLING METHODS ////////////////////////////////////////////////////
  selectPlant(e:any, index):void {
    if (index != this.countTanaman) {
      this.selectedPlants.push({ 'index': this.countTanaman, 'value' : e.item.pla_id});
    }
  }

  selectCompound(e:any, index):void {
    if (index != this.countCompound) {
      this.selectedCompounds.push({ 'index': this.countCompound, 'value' : e.item.com_id});
    }
  }

  selectProtein(e:any, index):void {
    if (index != this.countProtein) {
      this.selectedProteins.push({ 'index': this.countProtein, 'value' : e.item.pro_id});
    }
  }

  selectDisease(e:any, index):void {
    if (index != this.countDisease) {
      this.selectedDiseases.push({ 'index': this.countDisease, 'value' : e.item.dis_id});
    }
  }

  focusPlant(index: number) {
    this.activeCompound = false;
    if (index == this.countTanaman) {
      this.countTanaman++;
      this.plant.push({ 'index': this.countTanaman, 'value' : ''});
    }
  }

  focusCompound(index: number) {
    this.activeTanaman = false;
    if (index == this.countCompound) {
      this.countCompound++;
      this.compound.push({ 'index': this.countCompound, 'value' : ''});
    }
  }

  focusProtein(index: number) {
    this.activeDisease = false;
    if (index == this.countProtein) {
      this.countProtein++;
      this.protein.push({ 'index': this.countProtein, 'value' : ''});
    }
  }

  focusDisease(index: number) {
    this.activeProtein = false;
    if (index == this.countDisease) {
      this.countDisease++;
      this.disease.push({ 'index': this.countDisease, 'value' : ''});
    }
  }

  // SEARCH+PREDICT METHODS ////////////////////////////////////////////////////
  searchAndPredictButtonCallback() {
    this.click = true;

    let showPlant = false;
    let showCompound = false;
    let showProtein = false;
    let showDisease = false;

    if (this.plant.length > 1 && this.disease.length <= 1 && this.protein.length <= 1) {
        this.predictPlant();
        showPlant = true;
    }

    else if (this.compound.length > 1 && this.protein.length <= 1 && this.disease.length <= 1) {
        this.predictCompound();
        showCompound = true;
    }

    else if (this.protein.length > 1 && this.plant.length <= 1 && this.compound.length <= 1) {
        this.predictProtein();
        showProtein = true;
    }

    else if (this.disease.length > 1 && this.plant.length <= 1 && this.compound.length <= 1) {
        this.predictDisease();
        showDisease = true;
    }

    else if (this.plant.length > 1 && this.protein.length > 1) {
        this.predictPlantProtein();
    }

    else if (this.compound.length > 1 && this.disease.length > 1) {
        this.predictCompoundDisease();
    }

    if (this.plant.length > 1 && this.disease.length > 1) {
        this.searchAndPredict(this.selectedPlants,this.selectedDiseases)
    }

    if (this.compound.length > 1 && this.protein.length > 1) {
        this.predictCompoundProtein();
    }

    var inter = setInterval(() => {

      if (showPlant && !showProtein && !showDisease) {
        if (this.pTanaman) {
          localStorage.setItem('data', JSON.stringify(this.dataLocal));
          this.show = true;
          this.click = false;
          clearInterval(inter);
        }
      }

      else if (showCompound && !showProtein && !showDisease) {
        if(this.pCompound) {
          localStorage.setItem('data', JSON.stringify(this.dataLocal));
          this.show = true;
          this.click = false;
          clearInterval(inter);
        }
      }

      else if (showProtein && !showPlant && !showCompound) {
        if (this.pProtein) {
          localStorage.setItem('data', JSON.stringify(this.dataLocal));
          this.show = true;
          this.click = false;
          clearInterval(inter);
        }
      }

      else if (showDisease && !showPlant && !showCompound) {
        if (this.pDisease) {
          localStorage.setItem('data', JSON.stringify(this.dataLocal));
          this.show = true;
          this.click = false;
          clearInterval(inter);
        }
      }
      if (this.show) this.click = false;
    }, 100);
  }

  searchAndPredict(drugSideInput,targetSideInput) {
    console.log('searchAndPredict');

    let dsi = JSON.stringify(drugSideInput);
    let tsi = JSON.stringify(targetSideInput);
    // console.log(dsi);
    // console.log(tsi);

    let interactionQueryAPI = this.baseAPI+'query_interaction.php';
    let metaQueryAPI = this.baseAPI+'query_metadata.php'

    this.http.post(interactionQueryAPI,dsi).map(resp => resp.json())
    .subscribe(plaVScom => {
      this.http.post(interactionQueryAPI,tsi).map(resp2 => resp2.json())
      .subscribe(proVSdis => {
        let comVSproList = [];

        let i = 0;
        for (i;i<plaVScom.length;i++) {
          let j = 0;
          for (j;j<proVSdis.length;j++) {
            let comId = '"'+plaVScom[i]['com_id']+'"';
            let proId = '"'+proVSdis[j]['pro_id']+'"';
            let comVSpro = '{'+'"comId":'+comId+','+'"proId":'+proId+'}';
            comVSproList.push(comVSpro);
          }
        }

        // make unique
        comVSproList = comVSproList.filter((v, i, a) => a.indexOf(v) === i);

        // make it JSON-format
        let comVSproStr = '';
        let k = 0;
        for (k;k<comVSproList.length;k++) {
          comVSproStr = comVSproStr+comVSproList[k];
          if (k<comVSproList.length-1) {
            comVSproStr = comVSproStr + ',';
          }
        }
        comVSproStr = '['+comVSproStr+']';
        // console.log(comVSproStr);

        this.http.post(interactionQueryAPI,comVSproStr).map(resp3 => resp3.json())
        .subscribe(comVSpro => {
          // Get unique items
          let plaSet = this.getSet(plaVScom,'pla_id');
          let comSet = this.getSet(plaVScom,'com_id');
          // let comSet2 = this.getSet(comVSpro,'com_id');
          // let proSet2 = this.getSet(comVSpro,'pro_id');
          let proSet = this.getSet(proVSdis,'pro_id');
          let disSet = this.getSet(proVSdis,'dis_id');
          // console.log(plaSet.length);
          // console.log(comSet.length);
          // console.log(proSet.length);
          // console.log(disSet.length);

          // Get metadata of each unique item
          let plaMetaPost = this.getMetaPostStr(plaSet);
          let comMetaPost = this.getMetaPostStr(comSet);
          let proMetaPost = this.getMetaPostStr(proSet);
          let disMetaPost = this.getMetaPostStr(disSet);

          // console.log('getting meta ...');
          this.http.post(metaQueryAPI,plaMetaPost).map(resp4 => resp4.json())
          .subscribe(plaMeta => {
            this.http.post(metaQueryAPI,comMetaPost).map(resp5=>resp5.json())
            .subscribe(comMeta => {
              this.http.post(metaQueryAPI,proMetaPost).map(resp6=>resp6.json())
              .subscribe(proMeta => {
                this.http.post(metaQueryAPI,disMetaPost).map(resp7=>resp7.json())
                .subscribe(disMeta => {
                  // text output with detail metadata //////////////////////////
                  this.jsonPlantCompound = this.makeTextOutput(plaVScom,
                                                               plaMeta,comMeta,
                                                               'pla','com');
                  this.jsonCompoundProtein = this.makeTextOutput(comVSpro,
                                                               comMeta,proMeta,
                                                               'com','pro');
                  this.jsonProteinDisease = this.makeTextOutput(proVSdis,
                                                               proMeta,disMeta,
                                                               'pro','dis');

                  // graph output data prep ////////////////////////////////////
                  let graphData = [];
                  let nNodeMax = 10;

                  let plaForGraph = this.getItemForGraph(plaSet,nNodeMax);
                  let comForGraph = this.getItemForGraph(comSet,nNodeMax);
                  let proForGraph = this.getItemForGraph(proSet,nNodeMax);
                  let disForGraph = this.getItemForGraph(disSet,nNodeMax);

                  let graphDataArr = [this.getGraphData(plaVScom,plaForGraph,comForGraph),
                                      this.getGraphData(comVSpro,comForGraph,proForGraph),
                                      this.getGraphData(proVSdis,proForGraph,disForGraph)];

                  let ii=0;
                  for (ii;ii<graphDataArr.length;ii++) {
                    let jj=0;
                    let nNode=0;
                    for(jj;jj<graphDataArr[ii].length;jj++) {
                        let datum = graphDataArr[ii][jj];
                        graphData.push(datum);
                        nNode++;
                    }
                  }

                  localStorage.setItem('data', JSON.stringify(graphData));
                  this.show = true;
                })//disMeta
              })//proMeta
            })//comMeta
          })//plaMeta
        })
      })
    })
  }

  predictPlant() {

    this.plant.pop();
    let tanam = JSON.stringify(this.selectedPlants);
    console.log(tanam);

    this.http.post('http://ijah.apps.cs.ipb.ac.id/ijah/zz-plant.php', tanam)
      .map(res => res.json())
      .subscribe(data => {

        let plantCompound = data[0]['plant_compound'];
        let compoundProtein = data[1]['compound_protein'];
        let proteinDisease = data[2]['protein_disease'];

        ////////////////////////////////////////////////////////////////////////
        let plaComStr: string = '';
        let comProStr: string = '';
        let proDisStr: string = '';

        let i: number = 0;
        let ii: number = 0;// # of unique plants
        let prevPlaName = '';
        for(i;i<plantCompound.length;i++) {
          let plaName: string = plantCompound[i][0]
          let comName: string = plantCompound[i][1]
          let srcName: string = plantCompound[i][2]

          if (prevPlaName!=plaName) {
            ii = ii + 1;
            plaComStr = plaComStr + '#'+ii.toString()+' '+plaName+':\n';
            plaComStr = plaComStr + '  CAS,DrugbankID,KnapsackID,KeggID,source\n';

            prevPlaName = plaName;
          }

          let comNameComps = comName.split(')');
          let comCasId = comNameComps[0].replace('(','');
          let comDrugbankId = comNameComps[1].replace('(','');
          let comKnapsackId = comNameComps[2].replace('(','');
          let comKeggId = comNameComps[3].replace('(','');

          plaComStr = plaComStr+'  '+comCasId+','
                                    +this.getHyperlinkStr('drugbank',comDrugbankId)+','
                                    +this.getHyperlinkStr('knapsack',comKnapsackId)+','
                                    +this.getHyperlinkStr('kegg',comKeggId)+','
                                    +srcName
                                    +'\n';
        }

        // let prevComName = '';
        // for(i;i<compoundProtein.length;i++) {
        //   let comName: string = compoundProtein[i][0]
        //   let proName: string = compoundProtein[i][1]
        //   let srcName: string = compoundProtein[i][2]
        //
        //   if (prevComName!=comName) {
        //     ii = ii + 1;
        //     comProStr = comProStr + '#'+ii.toString()+' '+comName+':\n';
        //     comProStr = comProStr + '  CAS,DrugbankID,KnapsackID,KeggID,source\n';
        //
        //     prevComName = comName;
        //   }
        //
        //   let comNameComps = comName.split(')');
        //   let comCasId = comNameComps[0].replace('(','');
        //   let comDrugbankId = comNameComps[1].replace('(','');
        //   let comKnapsackId = comNameComps[2].replace('(','');
        //   let comKeggId = comNameComps[3].replace('(','');
        //
        //   comProStr = comProStr+'  '+comCasId+','
        //                             +this.getHyperlinkStr('drugbank',comDrugbankId)+','
        //                             +this.getHyperlinkStr('knapsack',comKnapsackId)+','
        //                             +this.getHyperlinkStr('kegg',comKeggId)+','
        //                             +srcName
        //                             +'\n';
        // }
        ////////////////////////////////////////////////////////////////////////

        let pla_comp = {};
        let comp_prot = {};
        let prot_dis = {};

        let count_pla_comp = 0;
        let count_comp_prot = 0;
        let count_prot_dis = 0;

        for(count_pla_comp; count_pla_comp < plantCompound.length; count_pla_comp++) {
          let temp = plantCompound[count_pla_comp][0];

          if (pla_comp[temp]) {
            let temp2 = pla_comp[temp];

            if (this.checkJson(temp2, plantCompound[count_pla_comp][1])) {
              temp2.push(plantCompound[count_pla_comp][1]);

              pla_comp[temp] = temp2;
            }

          }
          else {
            let a = [];
            a.push(plantCompound[count_pla_comp][1]);
            pla_comp[temp] = a;
          }
        }

        for(count_comp_prot; count_comp_prot < compoundProtein.length; count_comp_prot++) {
          let temp = compoundProtein[count_comp_prot][0];

          if (comp_prot[temp]) {
            let temp2 = comp_prot[temp];

            if(this.checkJson(temp2, compoundProtein[count_comp_prot][1])) {
              temp2.push(compoundProtein[count_comp_prot][1]);

              comp_prot[temp] = temp2;
            }

          }
          else {
            let a = [];
            a.push(compoundProtein[count_comp_prot][1]);
            comp_prot[temp] = a;
          }
        }

        for(count_prot_dis = 0; count_prot_dis < proteinDisease.length; count_prot_dis++) {
          let temp = proteinDisease[count_prot_dis][0];

          if (prot_dis[temp]) {
            let temp2 = prot_dis[temp];

            if (this.checkJson(temp2, proteinDisease[count_prot_dis][1])) {
              temp2.push(proteinDisease[count_prot_dis][1]);

              prot_dis[temp] = temp2;
            }

          }
          else {
            let a = [];
            a.push(proteinDisease[count_prot_dis][1]);
            prot_dis[temp] = a;
          }
        }

        ////////////////////////////////////////////////////////////////////////
        this.jsonPlantCompound = plaComStr;
        this.jsonCompoundProtein = JSON.stringify(comp_prot, undefined, 2);
        this.jsonProteinDisease = JSON.stringify(prot_dis, undefined, 2);
        ////////////////////////////////////////////////////////////////////////

        if (compoundProtein.length != 0) {

          for (let i = 0; i < 20; i++) {
            if (this.check(this.dataLocal, proteinDisease[i][0], proteinDisease[i][1])) {
              let push = [proteinDisease[i][0], proteinDisease[i][1], 1];
              this.dataLocal.push(push);

            }
          }

          for(let i = 0; i < compoundProtein.length; i++) {
            for (let j = 0; j < this.dataLocal.length; j++) {
              if (compoundProtein[i][1] == this.dataLocal[j][0]) {
                if (this.check(this.dataLocal, compoundProtein[i][0], compoundProtein[i][1])) {
                  let push = [compoundProtein[i][0], compoundProtein[i][1], 1];
                  this.dataLocal.push(push);
                }
              }
            }
          }

          for(let i = 0; i < plantCompound.length; i++) {
            for (let j = 0; j < this.dataLocal.length; j++) {
              if (plantCompound[i][1] == this.dataLocal[j][0]) {
                if (this.check(this.dataLocal, plantCompound[i][0], plantCompound[i][1])) {
                  let push = [plantCompound[i][0], plantCompound[i][1], 1 ];
                  this.dataLocal.push(push);
                }
              }
            }
          }

        }

        else {
          for (let i = 0; i < plantCompound.length; i++) {
            if (this.check(this.dataLocal, plantCompound[i][0], plantCompound[i][1])) {
              let push = [plantCompound[i][0], plantCompound[i][1], 1];
              this.dataLocal.push(push);
            }
          }
          for (let i = 0; i < compoundProtein.length; i++) {
            if (this.check(this.dataLocal, compoundProtein[i][0], compoundProtein[i][1])) {
              let push = [compoundProtein[i][0], compoundProtein[i][1], 1];
              this.dataLocal.push(push);
            }
          }

        }

        localStorage.setItem('data', JSON.stringify(this.dataLocal));
        localStorage.setItem('jsonPlaComp', JSON.stringify(pla_comp, undefined, 2));
        localStorage.setItem('jsonCompProt', JSON.stringify(comp_prot, undefined, 2));
        localStorage.setItem('jsonProtDis', JSON.stringify(prot_dis, undefined, 2));

        this.pTanaman = true;
        this.show = true;
        this.click = false;

      })
  }

  predictProtein() {

    this.protein.pop();
    let prot = JSON.stringify(this.selectedProteins);
    console.log(prot);

    this.http.post('http://ijah.apps.cs.ipb.ac.id/ijah/zz-protein.php', prot)
      .map(res => res.json())
      .subscribe(data => {

        let plantCompound = data[0]['plant_compound'];
        let compoundProtein = data[1]['compound_protein'];
        let proteinDisease = data[2]['protein_disease'];

        let pla_comp = {};
        let comp_prot = {};
        let prot_dis = {};

        ////////////////////////////////////////////////////////////////////////
        let plaComStr: string = '';
        let comProStr: string = '';
        let proDisStr: string = '';

        let i: number = 0;
        let ii: number = 0;// # of unique plants
        let prevPlaName = '';
        for(i;i<plantCompound.length;i++) {
          let plaName: string = plantCompound[i][0]
          let comName: string = plantCompound[i][1]
          let srcName: string = plantCompound[i][2]

          if (prevPlaName!=plaName) {
            ii = ii + 1;
            plaComStr = plaComStr + '#'+ii.toString()+' '+plaName+':\n';
            plaComStr = plaComStr + '  CAS,DrugbankID,KnapsackID,KeggID,source\n';

            prevPlaName = plaName;
          }

          let comNameComps = comName.split(')');
          let comCasId = comNameComps[0].replace('(','');
          let comDrugbankId = comNameComps[1].replace('(','');
          let comKnapsackId = comNameComps[2].replace('(','');
          let comKeggId = comNameComps[3].replace('(','');

          plaComStr = plaComStr+'  '+comCasId+','
                                    +this.getHyperlinkStr('drugbank',comDrugbankId)+','
                                    +this.getHyperlinkStr('knapsack',comKnapsackId)+','
                                    +this.getHyperlinkStr('kegg',comKeggId)+','
                                    +srcName
                                    +'\n';
        }

        ////////////////////////////////////////////////////////////////////////

        let count_pla_comp = 0;
        let count_comp_prot = 0;
        let count_prot_dis = 0;

        for(count_pla_comp; count_pla_comp < plantCompound.length; count_pla_comp++) {
          let temp = plantCompound[count_pla_comp][0];

          if (pla_comp[temp]) {
            let temp2 = pla_comp[temp];

            if (this.checkJson(temp2, plantCompound[count_pla_comp][1])) {
              temp2.push(plantCompound[count_pla_comp][1]);

              pla_comp[temp] = temp2;
            }

          }
          else {
            let a = [];
            a.push(plantCompound[count_pla_comp][1]);
            pla_comp[temp] = a;
          }
        }

        for(count_comp_prot; count_comp_prot < compoundProtein.length; count_comp_prot++) {
          let temp = compoundProtein[count_comp_prot][0];

          if (comp_prot[temp]) {
            let temp2 = comp_prot[temp];

            if(this.checkJson(temp2, compoundProtein[count_comp_prot][1])) {
              temp2.push(compoundProtein[count_comp_prot][1]);

              comp_prot[temp] = temp2;
            }

          }
          else {
            let a = [];
            a.push(compoundProtein[count_comp_prot][1]);
            comp_prot[temp] = a;
          }
        }

        for(count_prot_dis = 0; count_prot_dis < proteinDisease.length; count_prot_dis++) {
          let temp = proteinDisease[count_prot_dis][0];

          if (prot_dis[temp]) {
            let temp2 = prot_dis[temp];

            if (this.checkJson(temp2, proteinDisease[count_prot_dis][1])) {
              temp2.push(proteinDisease[count_prot_dis][1]);

              prot_dis[temp] = temp2;
            }

          }
          else {
            let a = [];
            a.push(proteinDisease[count_prot_dis][1]);
            prot_dis[temp] = a;
          }
        }

        this.jsonPlantCompound = plaComStr;
        this.jsonCompoundProtein = JSON.stringify(comp_prot, undefined, 2);
        this.jsonProteinDisease = JSON.stringify(prot_dis, undefined, 2);

        if (plantCompound.length != 0) {

          for (let i = 0; i < 20; i++) {
            for (let j = 0; j < compoundProtein.length; j++) {

              if (plantCompound[i][1] == compoundProtein[j][0]) {
                if (this.check(this.dataLocal, plantCompound[i][0], plantCompound[i][1])) {
                  let push = [plantCompound[i][0], plantCompound[i][1], 1];
                  this.dataLocal.push(push);
                }
                if (this.check(this.dataLocal, compoundProtein[j][0], compoundProtein[j][1])) {
                  let push = [compoundProtein[j][0], compoundProtein[j][1], 1];
                  this.dataLocal.push(push);
                }

              }

            }
          }

        }

        else {
          for (let i = 0; i < compoundProtein.length  / (this.protein.length * 10); i++) {
            if (this.check(this.dataLocal, compoundProtein[i][0], compoundProtein[i][1])) {
              let push = [compoundProtein[i][0], compoundProtein[i][1], 1];
              this.dataLocal.push(push);
            }
          }

        }

        for (let i = 0; i < proteinDisease.length ; i++) {
          if (this.check(this.dataLocal, proteinDisease[i][0], proteinDisease[i][1])) {
            let push = [proteinDisease[i][0], proteinDisease[i][1], 1];
            this.dataLocal.push(push);
          }
        }

        this.pProtein = true;


      })

  }

  predictCompound() {

    this.compound.pop();
    let comp = JSON.stringify(this.selectedCompounds);
    console.log(comp);

    this.http.post('http://ijah.apps.cs.ipb.ac.id/ijah/zz-compound.php', comp)
      .map(res => res.json())
      .subscribe(data => {

        let plantCompound = data[0]['plant_compound'];
        let compoundProtein = data[1]['compound_protein'];
        let proteinDisease = data[2]['protein_disease'];

        let pla_comp = {};
        let comp_prot = {};
        let prot_dis = {};

        ////////////////////////////////////////////////////////////////////////
        let plaComStr: string = '';
        let comProStr: string = '';
        let proDisStr: string = '';

        let i: number = 0;
        let ii: number = 0;// # of unique plants
        let prevPlaName = '';
        for(i;i<plantCompound.length;i++) {
          let plaName: string = plantCompound[i][0]
          let comName: string = plantCompound[i][1]
          let srcName: string = plantCompound[i][2]

          if (prevPlaName!=plaName) {
            ii = ii + 1;
            plaComStr = plaComStr + '#'+ii.toString()+' '+plaName+':\n';
            plaComStr = plaComStr + '  CAS,DrugbankID,KnapsackID,KeggID,source\n';

            prevPlaName = plaName;
          }

          let comNameComps = comName.split(')');
          let comCasId = comNameComps[0].replace('(','');
          let comDrugbankId = comNameComps[1].replace('(','');
          let comKnapsackId = comNameComps[2].replace('(','');
          let comKeggId = comNameComps[3].replace('(','');

          plaComStr = plaComStr+'  '+comCasId+','
                                    +this.getHyperlinkStr('drugbank',comDrugbankId)+','
                                    +this.getHyperlinkStr('knapsack',comKnapsackId)+','
                                    +this.getHyperlinkStr('kegg',comKeggId)+','
                                    +srcName
                                    +'\n';
        }
        ////////////////////////////////////////////////////////////////////////

        let count_pla_comp = 0;
        let count_comp_prot = 0;
        let count_prot_dis = 0;

        for(count_pla_comp; count_pla_comp < plantCompound.length; count_pla_comp++) {
          let temp = plantCompound[count_pla_comp][0];

          if (pla_comp[temp]) {
            let temp2 = pla_comp[temp];

            if (this.checkJson(temp2, plantCompound[count_pla_comp][1])) {
              temp2.push(plantCompound[count_pla_comp][1]);

              pla_comp[temp] = temp2;
            }

          }
          else {
            let a = [];
            a.push(plantCompound[count_pla_comp][1]);
            pla_comp[temp] = a;
          }
        }

        for(count_comp_prot; count_comp_prot < compoundProtein.length; count_comp_prot++) {
          let temp = compoundProtein[count_comp_prot][0];

          if (comp_prot[temp]) {
            let temp2 = comp_prot[temp];

            if(this.checkJson(temp2, compoundProtein[count_comp_prot][1])) {
              temp2.push(compoundProtein[count_comp_prot][1]);

              comp_prot[temp] = temp2;
            }

          }
          else {
            let a = [];
            a.push(compoundProtein[count_comp_prot][1]);
            comp_prot[temp] = a;
          }
        }

        for(count_prot_dis = 0; count_prot_dis < proteinDisease.length; count_prot_dis++) {
          let temp = proteinDisease[count_prot_dis][0];

          if (prot_dis[temp]) {
            let temp2 = prot_dis[temp];

            if (this.checkJson(temp2, proteinDisease[count_prot_dis][1])) {
              temp2.push(proteinDisease[count_prot_dis][1]);

              prot_dis[temp] = temp2;
            }

          }
          else {
            let a = [];
            a.push(proteinDisease[count_prot_dis][1]);
            prot_dis[temp] = a;
          }
        }

        this.jsonPlantCompound = plaComStr;
        this.jsonCompoundProtein = JSON.stringify(comp_prot, undefined, 2);
        this.jsonProteinDisease = JSON.stringify(prot_dis, undefined, 2);

        if (proteinDisease.length != 0 && compoundProtein.length != 0) {

          for (let i = 0; i < 20; i++) {
            for (let j = 0; j < compoundProtein.length; j++) {

              if (proteinDisease[i][0] == compoundProtein[j][1]) {
                if (this.check(this.dataLocal, proteinDisease[i][0], proteinDisease[i][1])) {
                  let push = [proteinDisease[i][0], proteinDisease[i][1], 1];
                  this.dataLocal.push(push);
                }
                if (this.check(this.dataLocal, compoundProtein[j][0], compoundProtein[j][1])) {
                  let push = [compoundProtein[j][0], compoundProtein[j][1], 1];
                  this.dataLocal.push(push);
                }

              }

            }
          }

        }

        else if (compoundProtein.length != 0){

          for (let i = 0; i < 20; i++) {
            if (this.check(this.dataLocal, compoundProtein[i][0], compoundProtein[i][1])) {
              let push = [compoundProtein[i][0], compoundProtein[i][1], 1];
              this.dataLocal.push(push);
            }
          }

        }

        let limit;
        if (plantCompound.length > 20) limit = 20;
        else limit = plantCompound.length;

        for (let i = 0; i < limit; i++) {
          if (this.check(this.dataLocal, plantCompound[i][0], plantCompound[i][1])) {
            let push = [plantCompound[i][0], plantCompound[i][1], 1];
            this.dataLocal.push(push);
          }
        }

        this.pCompound = true;
      })

  }

  predictDisease() {

    this.disease.pop();
    let dis = JSON.stringify(this.selectedDiseases);
    console.log(dis);

    this.http.post('http://ijah.apps.cs.ipb.ac.id/ijah/zz-disease.php', dis)
      .map(res => res.json())
      .subscribe(data => {

        let plantCompound = data[0]['plant_compound'];
        let compoundProtein = data[1]['compound_protein'];
        let proteinDisease = data[2]['protein_disease'];

        let pla_comp = {};
        let comp_prot = {};
        let prot_dis = {};

        ////////////////////////////////////////////////////////////////////////
        let plaComStr: string = '';
        let comProStr: string = '';
        let proDisStr: string = '';

        let i: number = 0;
        let ii: number = 0;// # of unique plants
        let prevPlaName = '';
        for(i;i<plantCompound.length;i++) {
          let plaName: string = plantCompound[i][0]
          let comName: string = plantCompound[i][1]
          let srcName: string = plantCompound[i][2]

          if (prevPlaName!=plaName) {
            ii = ii + 1;
            plaComStr = plaComStr + '#'+ii.toString()+' '+plaName+':\n';
            plaComStr = plaComStr + '  CAS,DrugbankID,KnapsackID,KeggID,source\n';

            prevPlaName = plaName;
          }

          let comNameComps = comName.split(')');
          let comCasId = comNameComps[0].replace('(','');
          let comDrugbankId = comNameComps[1].replace('(','');
          let comKnapsackId = comNameComps[2].replace('(','');
          let comKeggId = comNameComps[3].replace('(','');

          plaComStr = plaComStr+'  '+comCasId+','
                                    +this.getHyperlinkStr('drugbank',comDrugbankId)+','
                                    +this.getHyperlinkStr('knapsack',comKnapsackId)+','
                                    +this.getHyperlinkStr('kegg',comKeggId)+','
                                    +srcName
                                    +'\n';
        }
        ////////////////////////////////////////////////////////////////////////

        let count_pla_comp = 0;
        let count_comp_prot = 0;
        let count_prot_dis = 0;

        for(count_pla_comp; count_pla_comp < plantCompound.length; count_pla_comp++) {
          let temp = plantCompound[count_pla_comp][0];

          if (pla_comp[temp]) {
            let temp2 = pla_comp[temp];

            if (this.checkJson(temp2, plantCompound[count_pla_comp][1])) {
              temp2.push(plantCompound[count_pla_comp][1]);

              pla_comp[temp] = temp2;
            }

          }
          else {
            let a = [];
            a.push(plantCompound[count_pla_comp][1]);
            pla_comp[temp] = a;
          }
        }

        for(count_comp_prot; count_comp_prot < compoundProtein.length; count_comp_prot++) {
          let temp = compoundProtein[count_comp_prot][0];

          if (comp_prot[temp]) {
            let temp2 = comp_prot[temp];

            if(this.checkJson(temp2, compoundProtein[count_comp_prot][1])) {
              temp2.push(compoundProtein[count_comp_prot][1]);

              comp_prot[temp] = temp2;
            }

          }
          else {
            let a = [];
            a.push(compoundProtein[count_comp_prot][1]);
            comp_prot[temp] = a;
          }
        }

        for(count_prot_dis = 0; count_prot_dis < proteinDisease.length; count_prot_dis++) {
          let temp = proteinDisease[count_prot_dis][0];

          if (prot_dis[temp]) {
            let temp2 = prot_dis[temp];

            if (this.checkJson(temp2, proteinDisease[count_prot_dis][1])) {
              temp2.push(proteinDisease[count_prot_dis][1]);

              prot_dis[temp] = temp2;
            }

          }
          else {
            let a = [];
            a.push(proteinDisease[count_prot_dis][1]);
            prot_dis[temp] = a;
          }
        }

        this.jsonPlantCompound = plaComStr;
        this.jsonCompoundProtein = JSON.stringify(comp_prot, undefined, 2);
        this.jsonProteinDisease = JSON.stringify(prot_dis, undefined, 2);

        if (plantCompound.length != 0) {

          for (let i = 0; i < 20; i++) {
            for (let j = 0; j < compoundProtein.length; j++) {

              if (plantCompound[i][1] == compoundProtein[j][0]) {
                if (this.check(this.dataLocal, plantCompound[i][0], plantCompound[i][1])) {
                  let push = [plantCompound[i][0], plantCompound[i][1], 1];
                  this.dataLocal.push(push);
                }
                if (this.check(this.dataLocal, compoundProtein[j][0], compoundProtein[j][1])) {
                  let push = [compoundProtein[j][0], compoundProtein[j][1], 1];
                  this.dataLocal.push(push);
                }

              }

            }
          }

        }

        else {

          for(let i = 0; i < 20; i++) {
            for (let j = 0; j < this.dataLocal.length; j++) {
              if (compoundProtein[i][1] == this.dataLocal[j][0]) {
                if (this.check(this.dataLocal, compoundProtein[i][0], compoundProtein[i][1])) {
                  let push = [compoundProtein[i][0], compoundProtein[i][1], 1];
                  this.dataLocal.push(push);
                }
              }
            }
          }

        }


        for (let i = 0; i < proteinDisease.length; i++) {
          if (this.check(this.dataLocal, proteinDisease[i][0], proteinDisease[i][1])) {
            let push = [proteinDisease[i][0], proteinDisease[i][1], 1];
            this.dataLocal.push(push);
          }
        }

        this.pDisease = true;
      })

  }

  predictPlantProtein() {

    this.plant.pop();
    this.protein.pop();
    let tanam = JSON.stringify(this.selectedPlants);
    let prot = JSON.stringify(this.selectedProteins);

    let compoundProtein1;
    let compoundProtein2;

    let plantCompound;
    let proteinDisease;

    this.http.post('http://ijah.apps.cs.ipb.ac.id/ijah/zz-plant.php', tanam)
      .map(res => res.json())
      .subscribe(data => {

        plantCompound = data[0]['plant_compound'];
        compoundProtein1 = data[1]['compound_protein'];

        this.http.post('http://ijah.apps.cs.ipb.ac.id/ijah/zz-protein.php', prot)
          .map(res => res.json())
          .subscribe(data1 => {

            proteinDisease = data1[2]['protein_disease'];
            compoundProtein2 = data1[1]['compound_protein'];

            let pla_comp = {};
            let comp_prot = {};
            let prot_dis = {};

            ////////////////////////////////////////////////////////////////////////
            let plaComStr: string = '';
            let comProStr: string = '';
            let proDisStr: string = '';

            let i: number = 0;
            let ii: number = 0;// # of unique plants
            let prevPlaName = '';
            for(i;i<plantCompound.length;i++) {
              let plaName: string = plantCompound[i][0]
              let comName: string = plantCompound[i][1]
              let srcName: string = plantCompound[i][2]

              if (prevPlaName!=plaName) {
                ii = ii + 1;
                plaComStr = plaComStr + '#'+ii.toString()+' '+plaName+':\n';
                plaComStr = plaComStr + '  CAS,DrugbankID,KnapsackID,KeggID,source\n';

                prevPlaName = plaName;
              }

              let comNameComps = comName.split(')');
              let comCasId = comNameComps[0].replace('(','');
              let comDrugbankId = comNameComps[1].replace('(','');
              let comKnapsackId = comNameComps[2].replace('(','');
              let comKeggId = comNameComps[3].replace('(','');

              plaComStr = plaComStr+'  '+comCasId+','
                                        +this.getHyperlinkStr('drugbank',comDrugbankId)+','
                                        +this.getHyperlinkStr('knapsack',comKnapsackId)+','
                                        +this.getHyperlinkStr('kegg',comKeggId)+','
                                        +srcName
                                        +'\n';
            }
            ////////////////////////////////////////////////////////////////////////

            let count_pla_comp = 0;
            let count_comp_prot = 0;
            let count_prot_dis = 0;

            for(count_pla_comp; count_pla_comp < plantCompound.length; count_pla_comp++) {
              let temp = plantCompound[count_pla_comp][0];

              if (pla_comp[temp]) {
                let temp2 = pla_comp[temp];

                if (this.checkJson(temp2, plantCompound[count_pla_comp][1])) {
                  temp2.push(plantCompound[count_pla_comp][1]);

                  pla_comp[temp] = temp2;
                }

              }
              else {
                let a = [];
                a.push(plantCompound[count_pla_comp][1]);
                pla_comp[temp] = a;
              }
            }

            for(count_comp_prot; count_comp_prot < compoundProtein2.length; count_comp_prot++) {
              let temp = compoundProtein2[count_comp_prot][0];

              if (comp_prot[temp]) {
                let temp2 = comp_prot[temp];

                if(this.checkJson(temp2, compoundProtein2[count_comp_prot][1])) {
                  temp2.push(compoundProtein2[count_comp_prot][1]);

                  comp_prot[temp] = temp2;
                }

              }
              else {
                let a = [];
                a.push(compoundProtein2[count_comp_prot][1]);
                comp_prot[temp] = a;
              }
            }

            for(count_prot_dis = 0; count_prot_dis < proteinDisease.length; count_prot_dis++) {
              let temp = proteinDisease[count_prot_dis][0];

              if (prot_dis[temp]) {
                let temp2 = prot_dis[temp];

                if (this.checkJson(temp2, proteinDisease[count_prot_dis][1])) {
                  temp2.push(proteinDisease[count_prot_dis][1]);

                  prot_dis[temp] = temp2;
                }

              }
              else {
                let a = [];
                a.push(proteinDisease[count_prot_dis][1]);
                prot_dis[temp] = a;
              }
            }

            this.jsonPlantCompound = plaComStr;
            this.jsonCompoundProtein = JSON.stringify(comp_prot, undefined, 2);
            this.jsonProteinDisease = JSON.stringify(prot_dis, undefined, 2);

            for (let i = 0; i < compoundProtein1.length; i++) {

              for (let j = 0; j < proteinDisease.length; j++) {
                if (compoundProtein1[i][1] == proteinDisease[j][0]) {
                  let cp = compoundProtein1[i][0];
                  if (this.check(this.dataLocal, compoundProtein1[i][0], proteinDisease[j][0])) {
                    let push = [compoundProtein1[i][0], proteinDisease[j][0], 1];
                    this.dataLocal.push(push);
                  }

                  for (let z = 0; z < plantCompound.length; z++) {
                    if (plantCompound[z][1] == cp) {
                      if (this.check(this.dataLocal, plantCompound[z][0], plantCompound[z][1])) {
                        let push = [plantCompound[z][0], plantCompound[z][1], 1];
                        this.dataLocal.push(push);
                      }
                    }
                  }
                }
              }

            }

            for (let i = 0; i < proteinDisease.length; i++) {
              if (this.check(this.dataLocal, proteinDisease[i][0], proteinDisease[i][1])) {
                let push = [proteinDisease[i][0], proteinDisease[i][1], 1];
                this.dataLocal.push(push);
              }
            }

            localStorage.setItem('data', JSON.stringify(this.dataLocal));
            localStorage.setItem('jsonPlaComp', JSON.stringify(pla_comp, undefined, 2));
            localStorage.setItem('jsonCompProt', JSON.stringify(comp_prot, undefined, 2));
            localStorage.setItem('jsonProtDis', JSON.stringify(prot_dis, undefined, 2));
            this.show = true;

        })

    })

  }

  predictCompoundDisease() {

    this.compound.pop();
    this.disease.pop();
    let com = JSON.stringify(this.selectedCompounds);
    let dis = JSON.stringify(this.selectedDiseases);

    let compoundProtein1;
    let compoundProtein2;

    let plantCompound;
    let proteinDisease;

    this.http.post('http://ijah.apps.cs.ipb.ac.id/ijah/zz-compound.php', com)
      .map(res => res.json())
      .subscribe(data => {

        plantCompound = data[0]['plant_compound'];
        compoundProtein1 = data[1]['compound_protein'];

        this.http.post('http://ijah.apps.cs.ipb.ac.id/ijah/zz-disease.php', dis)
          .map(res => res.json())
          .subscribe(data1 => {

            proteinDisease = data1[2]['protein_disease'];
            compoundProtein2 = data1[1]['compound_protein'];

            let pla_comp = {};
            let comp_prot = {};
            let prot_dis = {};

            ////////////////////////////////////////////////////////////////////////
            let plaComStr: string = '';
            let comProStr: string = '';
            let proDisStr: string = '';

            let i: number = 0;
            let ii: number = 0;// # of unique plants
            let prevPlaName = '';
            for(i;i<plantCompound.length;i++) {
              let plaName: string = plantCompound[i][0]
              let comName: string = plantCompound[i][1]
              let srcName: string = plantCompound[i][2]

              if (prevPlaName!=plaName) {
                ii = ii + 1;
                plaComStr = plaComStr + '#'+ii.toString()+' '+plaName+':\n';
                plaComStr = plaComStr + '  CAS,DrugbankID,KnapsackID,KeggID,source\n';

                prevPlaName = plaName;
              }

              let comNameComps = comName.split(')');
              let comCasId = comNameComps[0].replace('(','');
              let comDrugbankId = comNameComps[1].replace('(','');
              let comKnapsackId = comNameComps[2].replace('(','');
              let comKeggId = comNameComps[3].replace('(','');

              plaComStr = plaComStr+'  '+comCasId+','
                                        +this.getHyperlinkStr('drugbank',comDrugbankId)+','
                                        +this.getHyperlinkStr('knapsack',comKnapsackId)+','
                                        +this.getHyperlinkStr('kegg',comKeggId)+','
                                        +srcName
                                        +'\n';
            }
            ////////////////////////////////////////////////////////////////////////

            let count_pla_comp = 0;
            let count_comp_prot = 0;
            let count_prot_dis = 0;

            for(count_pla_comp; count_pla_comp < plantCompound.length; count_pla_comp++) {
              let temp = plantCompound[count_pla_comp][0];

              if (pla_comp[temp]) {
                let temp2 = pla_comp[temp];

                if (this.checkJson(temp2, plantCompound[count_pla_comp][1])) {
                  temp2.push(plantCompound[count_pla_comp][1]);

                  pla_comp[temp] = temp2;
                }

              }
              else {
                let a = [];
                a.push(plantCompound[count_pla_comp][1]);
                pla_comp[temp] = a;
              }
            }

            for(count_comp_prot; count_comp_prot < compoundProtein2.length; count_comp_prot++) {
              let temp = compoundProtein2[count_comp_prot][0];

              if (comp_prot[temp]) {
                let temp2 = comp_prot[temp];

                if(this.checkJson(temp2, compoundProtein2[count_comp_prot][1])) {
                  temp2.push(compoundProtein2[count_comp_prot][1]);

                  comp_prot[temp] = temp2;
                }

              }
              else {
                let a = [];
                a.push(compoundProtein2[count_comp_prot][1]);
                comp_prot[temp] = a;
              }
            }

            for(count_prot_dis = 0; count_prot_dis < proteinDisease.length; count_prot_dis++) {
              let temp = proteinDisease[count_prot_dis][0];

              if (prot_dis[temp]) {
                let temp2 = prot_dis[temp];

                if (this.checkJson(temp2, proteinDisease[count_prot_dis][1])) {
                  temp2.push(proteinDisease[count_prot_dis][1]);

                  prot_dis[temp] = temp2;
                }

              }
              else {
                let a = [];
                a.push(proteinDisease[count_prot_dis][1]);
                prot_dis[temp] = a;
              }
            }

            this.jsonPlantCompound = plaComStr;
            this.jsonCompoundProtein = JSON.stringify(comp_prot, undefined, 2);
            this.jsonProteinDisease = JSON.stringify(prot_dis, undefined, 2);

            for (let z = 0; z < 20; z++) {
              if (this.check(this.dataLocal, plantCompound[z][0], plantCompound[z][1])) {
                let push = [plantCompound[z][0], plantCompound[z][1], 1];
                this.dataLocal.push(push);
              }
            }

            for (let i = 0; i < compoundProtein1.length; i++) {
              for (let j = 0; j < proteinDisease.length; j++) {
                if (compoundProtein1[i][1] == proteinDisease[j][0]) {
                  if (this.check(this.dataLocal, compoundProtein1[i][0], proteinDisease[j][0])) {
                    let push = [compoundProtein1[i][0], proteinDisease[j][0], 1];
                    this.dataLocal.push(push);
                  }

                  if (this.check(this.dataLocal, proteinDisease[j][0], proteinDisease[j][1])) {
                    let push = [proteinDisease[j][0], proteinDisease[j][1], 1];
                    this.dataLocal.push(push);
                  }
                }
              }
            }

            localStorage.setItem('data', JSON.stringify(this.dataLocal));
            localStorage.setItem('jsonPlaComp', JSON.stringify(pla_comp, undefined, 2));
            localStorage.setItem('jsonCompProt', JSON.stringify(comp_prot, undefined, 2));
            localStorage.setItem('jsonProtDis', JSON.stringify(prot_dis, undefined, 2));
            this.show = true;

        })

    })

  }

  predictCompoundProtein() {

    this.compound.pop();
    this.disease.pop();
    let com = JSON.stringify(this.selectedCompounds);
    let prot = JSON.stringify(this.selectedProteins);

    let compoundProtein1;
    let compoundProtein2;

    let plantCompound;
    let proteinDisease;

    this.http.post('http://ijah.apps.cs.ipb.ac.id/ijah/zz-compound.php', com)
      .map(res => res.json())
      .subscribe(data => {

        plantCompound = data[0]['plant_compound'];
        compoundProtein1 = data[1]['compound_protein'];

        this.http.post('http://ijah.apps.cs.ipb.ac.id/ijah/zz-protein.php', prot)
          .map(res => res.json())
          .subscribe(data1 => {

            proteinDisease = data1[2]['protein_disease'];
            compoundProtein2 = data1[1]['compound_protein'];

            let pla_comp = {};
            let comp_prot = {};
            let prot_dis = {};

            ////////////////////////////////////////////////////////////////////////
            let plaComStr: string = '';
            let comProStr: string = '';
            let proDisStr: string = '';

            let i: number = 0;
            let ii: number = 0;// # of unique plants
            let prevPlaName = '';
            for(i;i<plantCompound.length;i++) {
              let plaName: string = plantCompound[i][0]
              let comName: string = plantCompound[i][1]
              let srcName: string = plantCompound[i][2]

              if (prevPlaName!=plaName) {
                ii = ii + 1;
                plaComStr = plaComStr + '#'+ii.toString()+' '+plaName+':\n';
                plaComStr = plaComStr + '  CAS,DrugbankID,KnapsackID,KeggID,source\n';

                prevPlaName = plaName;
              }

              let comNameComps = comName.split(')');
              let comCasId = comNameComps[0].replace('(','');
              let comDrugbankId = comNameComps[1].replace('(','');
              let comKnapsackId = comNameComps[2].replace('(','');
              let comKeggId = comNameComps[3].replace('(','');

              plaComStr = plaComStr+'  '+comCasId+','
                                        +this.getHyperlinkStr('drugbank',comDrugbankId)+','
                                        +this.getHyperlinkStr('knapsack',comKnapsackId)+','
                                        +this.getHyperlinkStr('kegg',comKeggId)+','
                                        +srcName
                                        +'\n';
            }
            ////////////////////////////////////////////////////////////////////////

            let count_pla_comp = 0;
            let count_comp_prot = 0;
            let count_prot_dis = 0;

            for(count_pla_comp; count_pla_comp < plantCompound.length; count_pla_comp++) {
              let temp = plantCompound[count_pla_comp][0];

              if (pla_comp[temp]) {
                let temp2 = pla_comp[temp];

                if (this.checkJson(temp2, plantCompound[count_pla_comp][1])) {
                  temp2.push(plantCompound[count_pla_comp][1]);

                  pla_comp[temp] = temp2;
                }

              }
              else {
                let a = [];
                a.push(plantCompound[count_pla_comp][1]);
                pla_comp[temp] = a;
              }
            }

            for(count_comp_prot; count_comp_prot < compoundProtein2.length; count_comp_prot++) {
              let temp = compoundProtein2[count_comp_prot][0];

              if (comp_prot[temp]) {
                let temp2 = comp_prot[temp];

                if(this.checkJson(temp2, compoundProtein2[count_comp_prot][1])) {
                  temp2.push(compoundProtein2[count_comp_prot][1]);

                  comp_prot[temp] = temp2;
                }

              }
              else {
                let a = [];
                a.push(compoundProtein2[count_comp_prot][1]);
                comp_prot[temp] = a;
              }
            }

            for(count_prot_dis = 0; count_prot_dis < proteinDisease.length; count_prot_dis++) {
              let temp = proteinDisease[count_prot_dis][0];

              if (prot_dis[temp]) {
                let temp2 = prot_dis[temp];

                if (this.checkJson(temp2, proteinDisease[count_prot_dis][1])) {
                  temp2.push(proteinDisease[count_prot_dis][1]);

                  prot_dis[temp] = temp2;
                }

              }
              else {
                let a = [];
                a.push(proteinDisease[count_prot_dis][1]);
                prot_dis[temp] = a;
              }
            }

            this.jsonPlantCompound = plaComStr;
            this.jsonCompoundProtein = JSON.stringify(comp_prot, undefined, 2);
            this.jsonProteinDisease = JSON.stringify(prot_dis, undefined, 2);

            for (let z = 0; z < 20; z++) {
              if (this.check(this.dataLocal, plantCompound[z][0], plantCompound[z][1])) {
                let push = [plantCompound[z][0], plantCompound[z][1], 1];
                this.dataLocal.push(push);
              }
            }

            for (let i = 0; i < compoundProtein1.length; i++) {
              for (let j = 0; j < proteinDisease.length; j++) {
                if (compoundProtein1[i][1] == proteinDisease[j][0]) {
                  if (this.check(this.dataLocal, compoundProtein1[i][0], proteinDisease[j][0])) {
                    let push = [compoundProtein1[i][0], proteinDisease[j][0], 1];
                    this.dataLocal.push(push);
                  }

                  if (this.check(this.dataLocal, proteinDisease[j][0], proteinDisease[j][1])) {
                    let push = [proteinDisease[j][0], proteinDisease[j][1], 1];
                    this.dataLocal.push(push);
                  }
                }
              }
            }

            localStorage.setItem('data', JSON.stringify(this.dataLocal));
            localStorage.setItem('jsonPlaComp', JSON.stringify(pla_comp, undefined, 2));
            localStorage.setItem('jsonCompProt', JSON.stringify(comp_prot, undefined, 2));
            localStorage.setItem('jsonProtDis', JSON.stringify(prot_dis, undefined, 2));
            this.show = true;
        })
    })
  }

  // UTILITY METHODS ///////////////////////////////////////////////////////////
  getItemForGraph(set,max) {
    let itemForGraph = [];
    let kk = 0;
    for (kk;kk<set.length;kk++) {
      if (kk < max) {
        itemForGraph.push(set[kk]);
      }
      else {
        break;
      }
    }
    return itemForGraph;
  }

  getGraphData(interaction,itemArr1,itemArr2) {
    let key1 = itemArr1[0].substr(0,3).toLowerCase()+'_id';
    let key2 = itemArr2[0].substr(0,3).toLowerCase()+'_id';

    let data = [];

    let i=0;
    for (i;i<itemArr1.length;i++) {
      let j=0;
      for (j;j<itemArr2.length;j++) {
        let k=0;
        for (k;k<interaction.length;k++) {
          let id1 = interaction[k][key1];
          let id2 = interaction[k][key2];
          if (id1===itemArr1[i] && id2===itemArr2[j]) {
            let datum = [];
            let w = parseFloat(interaction[k]['weight']);
            datum.push(id1);
            datum.push(id2);
            datum.push(w);
            data.push(datum);
            break;
          }
        }
      }
    }
    return data;
  }

  getSet(interaction,id) {
    let set = [];

    let i=0;
    for (i;i<interaction.length;i++) {
      let item = interaction[i][id];
      if (set.indexOf(item) < 0) {
        set.push(item);
      }
    }

    return set;
  }

  getMetaPostStr(set) {
    let postStr = '';

    let i=0;
    for (i;i<set.length;i++) {
      let item = '"'+set[i]+'"';
      postStr = postStr+'{'+'"id":'+item+'}';
      if (i<set.length-1) {
        postStr = postStr+',';
      }
    }
    postStr = '['+postStr+']';
    // console.log(postStr);

    return postStr;
  }

  getPropKeys(type) {
    let keys: string[] = [];
    if (type==='pla') {
      keys.push('pla_name');
    }
    if (type==='com') {
      keys.push('com_cas_id');
      keys.push('com_drugbank_id');
      keys.push('com_kegg_id');
      keys.push('com_knapsack_id');
    }
    if (type==='pro') {
      keys.push('pro_uniprot_id');
      keys.push('pro_uniprot_abbrv');
      keys.push('pro_name');
    }
    if (type==='dis') {
      keys.push('dis_omim_id');
      keys.push('dis_name');
    }
    return keys;
  }

  getHyperlinkStr(type,seed) {
    let baseUrl: string = 'null';

    if (type==='com_knapsack_id') {
      baseUrl = 'http://kanaya.naist.jp/knapsack_jsp/information.jsp?sname=C_ID&word=';
    }
    if (type==='com_drugbank_id') {
      baseUrl = 'https://www.drugbank.ca/drugs/';
    }
    if (type==='com_kegg_id') {
      baseUrl = 'http://www.genome.jp/dbget-bin/www_bget?cpd:';
    }

    if (type==='pro_uniprot_id') {
      baseUrl = 'http://www.uniprot.org/uniprot/';
    }

    if (type==='dis_omim_id') {
      baseUrl = 'https://www.omim.org/entry/';
    }

    let urlStr:string = seed;
    if (seed!=='' && seed!=='null') {
      let url: string = baseUrl + seed;
      urlStr = '<a href="'+url+'" target="_blank">'+seed+'</a>';
    }
    if (urlStr.indexOf('null') !==-1 ) {
      urlStr = seed;
    }
    return urlStr;
  }

  getProps(id,keys,meta) {
    let prefix = id.substr(0,3);
    prefix = prefix.toLowerCase() + '_id';

    let i=0;
    for (i;i<meta.length;i++) {
      if (id===meta[i][prefix]) {
        break;
      }
    }

    let props = []
    let j=0;
    for(j;j<keys.length;j++) {
      props.push(meta[i][keys[j]]);
    }

    return props;
  }

  getHeader(type) {
    let header = 'DEFAULT_HEADER';
    if (type === 'com') {
      header = 'CAS,DrugbankID,KnapsackID,KeggID,weight,source';
    }
    if (type === 'pro') {
      header = 'UniprotID,UniprotAbbrv,UniprotName,weight,source';
    }
    if (type === 'dis') {
      header = 'OmimID,OmimName,weight,source';
    }
    return header;
  }

  makeTextOutput(interaction,srcMeta,destMeta,srcType,destType) {
    let text: string = '';

    let srcProp = [];
    let destProp = [];

    let srcPropKeys = this.getPropKeys(srcType);
    let destPropKeys = this.getPropKeys(destType);

    let i: number = 0;
    let ii: number = 0;// # of unique plants
    let prevSrc = '';
    for(i;i<interaction.length;i++) {
      let srcKey = srcType+'_id';
      let destKey = destType+'_id'
      let src = interaction[i][srcKey];
      let dest = interaction[i][destKey];
      let source = interaction[i]['source'];
      let weight = interaction[i]['weight'];

      if (prevSrc!=src) {
        ii = ii + 1;
        text = text+'#'+ii.toString()+' ';

        let srcProps = this.getProps(src,srcPropKeys,srcMeta);

        let j=0;
        for (j;j<srcProps.length;j++) {
          text = text+this.getHyperlinkStr( srcPropKeys[j],srcProps[j] );
          if (j<srcProps.length-1) {
            text = text + ',';
          }
        }
        text = text+':\n';
        text = text+'  '+this.getHeader(destType)+'\n';

        prevSrc = src;
      }

      let destProps = this.getProps(dest,destPropKeys,destMeta);
      let jj=0;
      text = text+'  ';
      for (jj;jj<destProps.length;jj++) {
        text = text+this.getHyperlinkStr( destPropKeys[jj],destProps[jj] );
        if (jj<destProps.length-1) {
          text = text + ',';
        }
      }
      text = text+','+weight+','+source;
      text = text+'\n';
    }

    return text;
  }

  downloadJSON(idata,ifname){
    var json = localStorage.getItem(idata);
    var blob = new Blob([json], {type: "text/plain;charset=utf-8"});
    saveAs(blob, ifname);
  }

  check(data, input1, input2) {

    for(var i = 0; i < data.length; i++) {
      if (data[i][0] == input1 && data[i][1] == input2) {
        return false;
      }
    }

    return true;
  }

  checkJson(data, input1) {

    for(var i = 0; i < data.length; i++) {
      if (data[i] == input1) {
        return false;
      }
    }

    return true;
  }

  getMaxKeys(json) {
    var m;
    for (var i in json) {
        if (json.hasOwnProperty(i)) {
           m = (typeof m == 'undefined' || i > m) ? i : m;
        }
    }
    return m;
  }

  reset() {
    this.activeTanaman = true;
    this.activeCompound = true;
    this.activeProtein = true;
    this.activeDisease = true;

    this.pTanaman = false;
    this.pCompound = false;
    this.pProtein = false;
    this.pDisease = false;

    this.plant = [{ 'index': this.countTanaman, 'value' : ''}];
    this.compound = [{ 'index': this.countCompound, 'value' : ''}];
    this.protein = [{ 'index': this.countProtein, 'value' : ''}];
    this.disease = [{ 'index': this.countDisease, 'value' : ''}];

    this.selectedPlants = [];
    this.selectedCompounds = [];
    this.selectedProteins = [];
    this.selectedDiseases = [];

    this.show = false;
    localStorage.clear();
    this.dataLocal = [];

    this.typeaheadNoResults = false;

    this.noResultPlant = false;
    this.noResultCompound = false;
    this.noResultProtein = false;
    this.noResultDisease = false;
  }

  // EXAMPLE-BUTTON METHODS ////////////////////////////////////////////////////
  example1() {
  this.reset();
  this.plant = [{ 'index': 1, 'value' : 'Datura stramonium'}, { 'index': 2, 'value' : 'Trifolium pratense'}, { 'index': 3, 'value' : 'Acacia senegal'}, { 'index': 4, 'value' : ''}];
  this.selectedPlants = [{"index":1,"value":"PLA00002565"},{"index":2,"value":"PLA00001090"},{"index":3,"value":"PLA00000325"}];

  this.countTanaman = 4;
  this.activeCompound = false;
  this.activeProtein = false;
  this.activeDisease = false;
  }

  example2() {
  this.reset();
  this.compound = [{ 'index': 1, 'value' : '117-39-5 | DB04216 | C00004631 | 5280343'}, { 'index': 2, 'value' : '61-50-7 | DB01488 | C00001407 | 6089'}, { 'index': 3, 'value' : '51-55-8 | DB00572 | C00002277 | 174174'}, { 'index': 4, 'value' : ''}];
  this.selectedCompounds = [{ 'index': 1, 'value' : 'COM00000058'}, { 'index': 2, 'value' : 'COM00000014'}, { 'index': 3, 'value' : 'COM00000039'}];

  this.countCompound = 2;
  this.activeDisease = false;
  this.activeTanaman = false;
  this.activeProtein = false;
  }

  example3() {
  this.reset();
  this.protein = [{ 'index': 1, 'value' : 'P07437 | Tubulin beta chain'}, { 'index': 2, 'value' : 'P02768 | Serum albumin'}, { 'index': 3, 'value' : ''}];
  this.selectedProteins = [{ 'index': 1, 'value' : 'PRO00002823'}, { 'index': 2, 'value' : 'PRO00001554'}];

  this.countProtein = 3;
  this.activeDisease = false;
  this.activeTanaman = false;
  this.activeCompound = false;
  }

  example4() {
  this.reset();
  this.disease = [{ 'index': 1, 'value' : '156610 | Skin creases, congenital symmetric circumferential, 1'}, { 'index': 2, 'value' : '614373 | Amyotrophic lateral sclerosis 16, juvenile'}, { 'index': 3, 'value' : '612244 | Inflammatory bowel disease 13'}, { 'index': 4, 'value' : ''}];
  this.selectedDiseases = [{ 'index': 1, 'value' : 'DIS00001455'}, { 'index': 2, 'value' : 'DIS00000803'}, { 'index': 3, 'value' : 'DIS00003796'}];

  this.countDisease = 4;
  this.activeProtein = false;
  this.activeTanaman = false;
  this.activeCompound = false;
  }

  example5() {
  this.reset();
  this.plant = [{ 'index': 1, 'value' : 'Catharanthus roseus'}, { 'index': 2, 'value' : 'Nigella sativa'}, { 'index': 3, 'value' : 'Cocos nucifera'}, { 'index': 4, 'value' : ''}];
  this.selectedPlants = [{"index":1,"value":"PLA00001025"},{"index":2,"value":"PLA00003511"},{"index":3,"value":"PLA00001600"}];
  this.countTanaman = 4;

  this.protein = [{ 'index': 1, 'value' : 'P07437 | Tubulin beta chain'}, { 'index': 2, 'value' : 'P02768 | Serum albumin'}, { 'index': 3, 'value' : ''}];
  this.selectedProteins = [{ 'index': 1, 'value' : 'PRO00002823'}, { 'index': 2, 'value' : 'PRO00001554'}];

  this.countProtein = 3;

  this.activeDisease = false;
  this.activeCompound = false;
  }

  example6() {
  this.reset();
  this.compound = [{ 'index': 1, 'value' : '51-55-8 | DB00572 | C00002277 | 174174'}, { 'index': 2, 'value' : '51-34-3 | DB00747 | C00002292 | C01851'}, { 'index': 3, 'value' : '53-86-1 | DB00328 | C00030512 | C01926'}, { 'index': 4, 'value' : ''}];
  this.selectedCompounds = [{ 'index': 1, 'value' : 'COM00000039'}, { 'index': 2, 'value' : 'COM00001628'}, { 'index': 3, 'value' : 'COM00005599'}];

  this.countCompound = 2;

  this.disease = [{ 'index': 1, 'value' : '608516 | Major depressive disorder'}, { 'index': 2, 'value' : '100100 | Prune belly syndrome'}, { 'index': 3, 'value' : '614473 | Arterial calcification of infancy, generalized, 2'}, { 'index': 4, 'value' : ''}];
  this.selectedDiseases = [{ 'index': 1, 'value' : 'DIS00000849'}, { 'index': 2, 'value' : 'DIS00003796'}, { 'index': 3, 'value' : 'DIS00000853'}];

  this.countDisease = 4;

  this.activeTanaman = false;
  this.activeProtein = false;
  }

  example7() {
  this.reset();
  this.plant = [{ 'index': 1, 'value' : 'Aloe vera'}, { 'index': 2, 'value' : 'Cocos nucifera'}, { 'index': 3, 'value' : 'Panax ginseng'}, { 'index': 4, 'value' : ''}];
  this.selectedPlants = [{"index":1,"value":"PLA00001504"},{"index":2,"value":"PLA00001600"},{"index":3,"value":"PLA00003447"}];
  this.countDisease = 4;

  this.disease = [{ 'index': 1, 'value' : '61600 | Analbuminemia'}, { 'index': 2, 'value' : '615999 | Hyperthyroxinemia, familial dysalbuminemic'}, { 'index': 3, 'value' : ''}];
  this.selectedDiseases = [{ 'index': 1, 'value' : 'DIS00003787'}, { 'index': 2, 'value' : 'DIS00003675'}];

  this.countDisease = 3;

  this.activeCompound = false;
  this.activeProtein = false;
  }

  example8() {
  this.reset();
  this.compound = [{ 'index': 1, 'value' : '51-55-8 | DB00572 | C00002277 | 174174'}, { 'index': 2, 'value' : '61-50-7 | DB01488 | C00001407 | 6089'}, { 'index': 3, 'value' : '117-39-5 | DB04216 | C00004631 | 5280343'}, { 'index': 4, 'value' : ''}];
  this.selectedCompounds = [{ 'index': 1, 'value' : 'COM00000039'}, { 'index': 2, 'value' : 'COM00000014'}, { 'index': 3, 'value' : 'COM00000058'}];

  this.countCompound = 2;

  this.protein = [{ 'index': 1, 'value' : 'P53985 | Monocarboxylate transporter 1'}, { 'index': 2, 'value' : 'P20309 | Muscarinic acetylcholine receptor M3'}, { 'index': 3, 'value' : 'Q99720 | Sigma non-opioid intracellular receptor 1'}, { 'index': 4, 'value' : ''}];
  this.selectedProteins = [{ 'index': 1, 'value' : 'PRO00000040'}, { 'index': 2, 'value' : 'PRO00000452'}, { 'index': 3, 'value' : 'PRO00000377'}];

  this.countProtein = 4;

  this.activeTanaman = false;
  this.activeDisease = false;
  }
}
