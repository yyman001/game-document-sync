<template>
  <div class="card-content">
    <div class="card-box">
      <Card :key="item.gameName" v-for="item in gameList" :item="item"></Card>
    </div>
  </div>
</template>

<script>
import Card from '../Card'

export default {
  name: 'games-mod',
  components: { Card },
  data () {
    return {
      gameList: [
        {
          steamId: '1366540',
          gameName: 'Dyson Sphere Program',
          nickName: '戴森球计划',
          gameDocDir: 'Dyson Sphere Program',
          gameDocPath: '\\Documents\\Dyson Sphere Program',
          systemType: 'Windows',
          gamePlatform: [],
          createTime: 1627979179352,
          lastBackTime: 1631010012438,
          _id: 'ZLIpCXkW3wTGUBNM'
        },
        {
          steamId: '413150',
          gameName: 'StardewValley',
          nickName: '星谷物语',
          gameDocDir: 'StardewValley',
          gameDocPath: '\\AppData\\Roaming\\StardewValley',
          systemType: 'Windows',
          gamePlatform: [],
          createTime: 1627968120573,
          lastBackTime: 1637586076315,
          _id: 'dk5KExRi3JmNgj09'
        },
        {
          steamId: '280160',
          gameName: 'Aragami',
          nickName: '荒神',
          gameDocDir: 'Aragami',
          gameDocPath: '\\AppData\\LocalLow\\Lince Works\\Aragami',
          systemType: 'Windows',
          gamePlatform: [],
          createTime: 1627979168366,
          lastBackTime: 1631010065840,
          _id: 'nNOQrsFEYOJL21dG'
        },
        {
          steamId: '367520',
          gameName: 'Hollow Knight',
          nickName: '空洞骑士',
          gameDocDir: 'Hollow Knight',
          gameDocPath: '\\AppData\\LocalLow\\Team Cherry\\Hollow Knight',
          systemType: 'Windows',
          gamePlatform: [],
          createTime: 1627979184938,
          lastBackTime: 1631010005539,
          _id: 'pNwA5HfxoKkuNdsu'
        }
      ]
    }
  }
}
</script>

<style></style>
