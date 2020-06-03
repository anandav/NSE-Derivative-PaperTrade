import Vuex from "vuex";
import Vue from "vue";

import {
  //GETPORTFOLIOBYID,
  //  ADDEDITSTRATEGY,
  GETALLPORTFOLIOS,
  SETPORTFOLIO,
  SHOWNEWTRADE,
  GETINSTRUMENTDETAIL,
  REMOVETRADE,
} from "./mutationtype";

Vue.use(Vuex);
const axios = require("axios");
const state = {
  Portfolios: [],
  //Strategies: [],
  Portfolio: undefined,
  Strategy: undefined,
  Trade: undefined,
  InsurumentDetail: undefined,
  InsurumentLatestPirce: undefined,
};
const mutations = {
  [GETALLPORTFOLIOS](state, _portfolios) {
    state.Portfolios = _portfolios;
  },
  [SETPORTFOLIO](state, _protfolio) {
    state.Portfolio = _protfolio;
  },
  [SHOWNEWTRADE](state, _strategy) {
    state.Strategy = _strategy;
    state.Portfolio.Strategies.forEach((x) => {
      if (x._id.$oid != _strategy._id.$oid) {
        x.IsEdit = false;
      }
    });
  },
  [GETINSTRUMENTDETAIL](state, _data) {
    state.InsurumentDetail = _data;
  },
  [REMOVETRADE](state, _strategy) {
    console.log(state == undefined);
    var inx = state.Portfolio.Strategies.findIndex(
      (x) => x._id.$oid == _strategy._id.$oid
    );
    state.Portfolio.Strategies.splice(inx, 1, _strategy);
  },
};
const actions = {
  async GetAllPortfolios({ commit }) {
    const response = await axios.get("/mongoDBData.json");
    //console.log(response.data);
    commit(GETALLPORTFOLIOS, response.data);
  },
  SelectPortfolioChanged({ commit }, _protfolio) {
    commit(SETPORTFOLIO, _protfolio);
  },
  ShowNewTrade({ commit }, _strategy) {
    _strategy.IsEdit = !_strategy.IsEdit;
    commit(SHOWNEWTRADE, _strategy);
  },
  async GetPortfolioById({ commit }, _id) {
    var _protfolio = state.Portfolios.find((x) => x._id.$oid == _id);
    _protfolio.Strategies.forEach((x) => {
      x.IsEdit = false;
    });

    commit(SETPORTFOLIO, _protfolio);
  },

  async GetInstrumentDetail({ commit }, _insurumentSymbol) {
    console.log("Geting detail for" + _insurumentSymbol);
    const response = await axios.get("/chart-databyindex.json");
    console.log(response.data);
    commit(GETINSTRUMENTDETAIL, response.data);
  },

  RemoveTrade({ commit }, { _strategy, _trade }) {
    _strategy.Trades = _strategy.Trades.filter(
      (x) => x._id.$oid != _trade._id.$oid
    );
    commit(REMOVETRADE, _strategy);
  },
};
const modules = {};

const getters = {
  getLatestPrice: function(state) {
    if (state.InsurumentDetail && state.InsurumentDetail.grapthData) {
      var inx = state.InsurumentDetail.grapthData.length;
      var _data = state.InsurumentDetail.grapthData[inx - 1];
      console.log(_data[1]);
      return _data[1];
    }
  },
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules,
  getters,
});
