var coverYourAssets = new Vue({
    el: '#coverYourAssets',
    data: {
        addcoolthings: true,
        testing: false,
        allComputers: false,
	    goofGoober: always,
        imageFileLocation: "../../images/coverYourAssets/",
        image_background: "background.png",
        image_cardBack: "cardBack.jpg",
        image_arrow: "arrow.png",
        cards: [
            {
                id: 1,
                name: "Baseball Cards",
                price: 5000,
                quantity: 10,
                image: "cardBaseballCards.jpg"
            },
            {
                id: 2,
                name: "Cash Under The Mattress",
                price: 5000,
                quantity: 10,
                image: "cardCashUnderTheMattress.jpg"
            },
            {
                id: 3,
                name: "Stamp Collection",
                price: 5000,
                quantity: 10,
                image: "cardStampCollection.jpg"
            },
            {
                id: 4,
                name: "Piggy Bank",
                price: 5000,
                quantity: 10,
                image: "cardPiggyBank.jpg"
            },
            {
                id: 5,
                name: "Stocks",
                price: 10000,
                quantity: 10,
                image: "cardStocks.jpg"
            },
            {
                id: 6,
                name: "Coin Collection",
                price: 10000,
                quantity: 10,
                image: "cardCoinCollection.jpg"
            },
            {
                id: 7,
                name: "Bank Account",
                price: 10000,
                quantity: 10,
                image: "cardBankAccount.jpg"
            },
            {
                id: 8,
                name: "Classic Auto",
                price: 15000,
                quantity: 10,
                image: "cardClassicAuto.jpg"
            },
            {
                id: 9,
                name: "Jewels",
                price: 15000,
                quantity: 10,
                image: "cardJewels.jpg"
            },
            {
                id: 10,
                name: "Home",
                price: 20000,
                quantity: 8,
                image: "cardHome.jpg"
            },
            {
                id: 11,
                name: "Silver",
                price: 25000,
                quantity: 8,
                image: "cardSilver.jpg"
            },
            {
                id: 12,
                name: "Gold",
                price: 50000,
                quantity: 4,
                image: "cardGold.jpg"
            }
        ],
        newGame: {
            name: "SGProjectCoverYourAssets",
            players: [],
            playerTurn: 0,
            numberOfComputers: 3,
            gameStart: false,
            newGame: false,
            deck: [],
            discardPile: [],
            computerDifficulty: "Medium",
            rounds: [], 
            winner: []
        },
        game: {
            name: "SGProjectCoverYourAssets",
            players: [],
            playerTurn: 0,
            numberOfComputers: 3,
            gameStart: false,
            newGame: false,
            deck: [],
            discardPile: [],
            computerDifficulty: "Medium",
            rounds: [], 
            winner: []
        },
        basePlayer: {
            id: 1,
            name: "",
            cardsInHand: [],
            assetPileCards: [],
            computer: false,
            currentWealth: 0,
            cumulativeWealth: 0,
            challengedCards: [],
            computerThinking: false
        },
        draggedCard: "",
        droppedOnCard: "",
        draggedCardIndex: -1,
        dragOverCardIndex: -1,
        fromCardHtmlId: 0,
        toCardHtmlId: 0,
        numberOfCardsToDeal: 4,
        typedName: "",
        computerDifficulties: [
            "Easy",
            "Medium",
            "Hard",
            "Cheater"
        ],
        cardsDealt: true,
        counter: 1,
        cardIdForAnimation: 1,
        visibleAssets: [],
        draggingFromDiscard: false,
        playerDraw: false,
        moveCardHandToAsset: false,
        moveCardDiscardToAsset: false,
        moveCardHandToDiscard: false,
        playerPosition: 0,
        timePerDraw: 500,
        timePerDrawInitialDeal: 250,
        challengeActive: false,
        timeForComputerToThink: 2000,
        topCardOnDiscardBeforeRemoval: {},
        cardMovingFromHand: {},
        currentChallengedPlayer: {},
        currentChallengerPlayer: {},
        hasPreviousGame: false,
        hintPopup: {
            text: "You cannot trade using a card from the discard pile.",
            show: false,
            closingPopup: false
        },
        roundStandingsPopup: {
            show: false,
            text: "Current standings:",
            colHeaders: ["Name", "Round Wealth", "Total Wealth"]
        },
        showBackgroundOverlay: false,
        addingTempCard: false,
        computerCompeteIfPrice: 50000,

    },

    mounted( ) {
        console.clear()
        this.initLocalStorageObject()
        var game = this.getLocalStorageObject(this.game.name)
        this.prepareGame()
    },

    methods: {
        showHintPopup(text) {
            this.hintPopup.text = text
            this.hintPopup.show = true
        },

        hideHintPopup() {
            this.hintPopup.closingPopup = true
            document.getElementById('hintPopup').classList.remove('fadeIn')
            document.getElementById('hintPopup').classList.add('fadeOut')
            setTimeout(function () {
                coverYourAssets.hintPopup.show = false
                document.getElementById('hintPopup').classList.add('fadeIn')
            }, 1000)

        },
        
        clickedCard(){
            this.showHintPopup("Drag cards together to form an asset pile.")  
        },

        endRound() {
            this.game.rounds.push(this.getParsedObject(this.game))
            this.clearRound()
            this.loadCumulativeWealths()
            
            if(!this.checkIfGameOver()){
                
                setTimeout(function(){
                    coverYourAssets.showRoundStandingsPopup()
                    coverYourAssets.cardsDealt = false
                }, 50)
            }
            else{
                setTimeout(function(){
                    coverYourAssets.endGame()
                }, 50)
            }
        },
        
        gameIsOver(){
            if(this.game.winner.length > 0){
                return true
            }
            else{
                return false
            }
        },
        
        endGame(){
            console.log("ending game")
            this.findWinner()
            this.showRoundStandingsPopup()
            this.saveGame()
        },
        
        mainMenu(){
            localStorage.removeItem(this.newGame.name)
            this.pageRefresh()
        },
        
        pageRefresh(){
            window.location.reload()
        },
        
        findWinner(){
            var winner
            var mostWealth = 999999
            var winners = []
            
            for(var i = 0; i < this.game.players.length;i++){
                if(this.game.players[i].cumulativeWealth > mostWealth){
                    mostWealth = this.game.players[i].cumulativeWealth
                    winner = this.game.players[i]
                }
            }
            
            for(var i = 0; i < this.game.players.length;i++){
                if(this.game.players[i].cumulativeWealth == mostWealth){
                    winners.push(this.game.players[i])
                }
            }
            
            if(winners.length > 1){
                this.game.winner = winners
            }
            else{
                this.game.winner.push(winner)
            } 
        },
        
        checkIfGameOver(){
            for(var i = 0; i < this.game.players.length;i++){
                if(this.game.players[i].cumulativeWealth > 1000000){
                    return true
                }
            }
            return false
        },
        
        showRoundStandingsPopup(){
            this.showBackgroundOverlay = true
            this.roundStandingsPopup.show = true  
        },
        
        hideRoundStandingsPopup(){
            this.showBackgroundOverlay = false
            this.roundStandingsPopup.show = false
        },
        
        convertNumberToCurrency(number){
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });
            var value = formatter.format(number)
            value = value.replace('.00', '')
            return value
        },
        
        beginNextRound(){
            this.hideRoundStandingsPopup()
            this.startingDeal()
            this.saveGame()
        },

        loadCumulativeWealths() {
            for (var i = 0; i < this.game.players.length; i++) {
                this.game.players[i].cumulativeWealth = this.getPlayerCumulativeWealth(this.game.players[i])
            }
        },

        getPlayerCumulativeWealth(player) {
            var cumWealth = 0
            for (var i = 0; i < this.game.rounds.length; i++) {
                for (var j = 0; j < this.game.rounds[i].players.length; j++) {
                    if (this.game.rounds[i].players[j].id == player.id) {
                        cumWealth = this.game.rounds[i].players[j].currentWealth + this.game.rounds[i].players[j].cumulativeWealth
                    }
                }
            }
            return cumWealth
        },

        clearRound() {
            this.clearPlayerStats()
            this.resetDeckAndDiscard()
        },

        resetDeckAndDiscard() {
            this.game.deck.length = 0
            this.game.discardPile.length = 0
            this.initDeck()
        },

        clearPlayerStats() {
            for (var i = 0; i < this.game.players.length; i++) {
                this.game.players[i].cardsInHand.length = 0
                this.game.players[i].assetPileCards.length = 0
                this.game.players[i].currentWealth = 0
            }
        },

        checkIfEndRound() {
            for (var i = 0; i < this.game.players.length; i++) {
                if (this.game.players[i].cardsInHand.length > 0) {
                    return false
                }
            }
            this.endRound()
        },

        playerIsCurrentPlayer(player) {
            if (player.id == this.getCurrentPlayer().id) {
                return true
            } else {
                return false
            }
        },

        showAssetGroup(group, bool) {
            if (bool) {
                this.visibleAssets = group
            } else {
                this.visibleAssets = []
            }
        },

        giveAllPlayersSomeAssets() {
            for (var i = 0; i < this.game.players.length; i++) {
                for (var j = 0; j < 2; j++) {
                    this.game.players[i].assetPileCards.push([this.getParsedObject(this.cards[j]), this.getParsedObject(this.cards[j])])
                    this.game.players[i].assetPileCards.push([this.getParsedObject(this.cards[j + 1]), this.getParsedObject(this.cards[11]), this.getParsedObject(this.cards[j + 1]), this.getParsedObject(this.cards[j + 1]), this.getParsedObject(this.cards[j + 1]), this.getParsedObject(this.cards[j + 1]), this.getParsedObject(this.cards[j + 1]), this.getParsedObject(this.cards[j + 1]), this.getParsedObject(this.cards[j + 1])])
                    this.game.players[i].assetPileCards.push([this.getParsedObject(this.cards[j + 2]), this.getParsedObject(this.cards[j + 2])])
                }
            }
        },


        play() {
            this.createPlayers()
            this.cardsDealt = false
            this.setGameStart(true)
            this.game.computerDifficulty = this.newGame.computerDifficulty
            if (this.testing) {
                this.dealCardsAnimation()
                this.dealCardsToPlayers()
                this.startGame()
                this.giveAllPlayersSomeAssets()
            } else {
                this.startingDeal()
            }
        },
        
        startingDeal(){
            setTimeout(function () {
                coverYourAssets.dealCardsAnimation()
                coverYourAssets.dealCardsToPlayers()
            }, 500)

            setTimeout(function () {
                coverYourAssets.startGame()
            }, (this.timePerDrawInitialDeal * 16) + 1000) 
        },

        dealCardsAnimation() {
            var elementBaseId = "cardBeingDealt-"

            for (var i = 0; i < 16; i++) {
                var timer = (i * this.timePerDrawInitialDeal)

                setTimeout(function () {
                    var playerNumber = coverYourAssets.counter
                    document.getElementById(elementBaseId + coverYourAssets.cardIdForAnimation).className = "dealCard" + playerNumber + " dealCard"
                    coverYourAssets.counter == 4 ? coverYourAssets.counter = 1 : coverYourAssets.counter++
                    coverYourAssets.cardIdForAnimation++
                }, timer)

            }
        },

        dealIndividualCard(player, numberOfCards) {
            if(this.game.deck.length == 0){
                this.challengeActive ? '' : this.endTurn()
            }
            else{
                console.log("dealing card")
                var cardsToDraw = numberOfCards
                if (this.game.deck.length < cardsToDraw) {
                    cardsToDraw = this.game.deck.length
                }
                this.playerDraw = true
                var positionId = player.id
                var elementId = "cardBeingDealt-" + (positionId)
                var timer
                var counter = 0
                for (var i = 0; i < cardsToDraw; i++) {
                    timer = ( i * (this.timePerDraw * 2)) + 10

                    setTimeout(function () {
                        try{
                            document.getElementById(elementId).className = "dealCardToHand" + positionId + " dealCard"    
                        }
                        catch(error){
                            console.log(error)
                            console.log(player)
                        }

                    }, timer)

                    setTimeout(function () {
                        counter++
                        document.getElementById(elementId).className = "displayNone"
                        coverYourAssets.playerDrawCard(player)
                        if (counter == cardsToDraw) {
                            coverYourAssets.playerDraw = false
                            coverYourAssets.challengeActive ? '' : coverYourAssets.endTurn()
                        }
                    }, timer + this.timePerDraw)
                }
            }
        },
        
        playerHasNoCardsLeft(player){
            if(player.cardsInHand.length == 0){
                return true
            }
            else{
                return false
            }
        },
        
        playerIsComputer(player){
            if(player.computer){
                return true
            }
            else{
                return false
            } 
        },

        endTurn() {
            var maxSeconds = 3
            var minSeconds = 1
            var secondsBetweenTurns = Math.floor(Math.random() * maxSeconds) + minSeconds;
            var timeBetweenTurns = secondsBetweenTurns * 1000
            console.log("ENDING " + this.getCurrentPlayer().name + "s turn -----")
            
            if( !this.checkIfEndRound()){
                this.incrementTurn()
                var currentPlayer = this.getCurrentPlayer()

                if( this.playerHasNoCardsLeft(currentPlayer) && this.playerIsComputer(currentPlayer) ){
                    this.takeTurn()
                }
                else{
                    if( this.playerIsComputer(currentPlayer) ){
                        currentPlayer.computerThinking = true
                        setTimeout(function () {
                            currentPlayer.computerThinking = false
                            coverYourAssets.takeTurn()
                        }, timeBetweenTurns)
                    }
                    else{
                        this.saveGame()
                    }
                    console.log("----- " + currentPlayer.name + "s Turn")
                }
            }
        },
        
        getRoundLeader(){
            var leader
            var highest = 0
            
            for(var i = 0; i < this.game.rounds[this.game.rounds.length-1].players.length;i++){
                if(this.game.rounds[this.game.rounds.length-1].players[i].currentWealth > highest){
                    leader = this.game.rounds[this.game.rounds.length-1].players[i]
                    highest = this.game.rounds[this.game.rounds.length-1].players[i].currentWealth
                }
            }
            return leader
        },
        
        getOverallLeader(){
            var leader
            var highest = 0
            
            for(var i = 0; i < this.game.players.length;i++){
                if(this.game.players[i].cumulativeWealth > highest){
                    leader = this.game.players[i]
                    highest = this.game.players[i].cumulativeWealth
                }
            }
            return leader
        },

        moveCardFromHandToAssets(player) {
            var numOfCards = 1
            var alterRotate = false
            console.log(player.assetPileCards.length%2)
            if(player.assetPileCards.length%2 != 0){
                alterRotate = true
            }
            
            if(player.assetPileCards.length%2 != 0 && this.addingTempCard){
                alterRotate = false
            }
            else if(player.assetPileCards.length%2 == 0 && this.addingTempCard){
                alterRotate = true
            }
            console.log(alterRotate)
            this.moveCardHandToAsset = true
            var positionId = player.id
            var elementId = "cardMoveFromHandToAsset-" + (positionId)
            var timer = 10
            setTimeout(function () {
                if(alterRotate){
                    coverYourAssets.setElementClassName(elementId, "cardFromHandToAsset" + positionId + "_2 dealCard")
                }
                else{
                    coverYourAssets.setElementClassName(elementId, "cardFromHandToAsset" + positionId + " dealCard")
                }
            }, timer)

            setTimeout(function () {
                coverYourAssets.setElementClassName(elementId, "displayNone")
                coverYourAssets.moveCardHandToAsset = false
            }, timer + this.timePerDraw)
        },
        
        setElementClassName(elId, className){
            document.getElementById(elId).className = className
        },

        moveCardFromDiscardToAssets(player) {
            this.moveCardDiscardToAsset = true
            var alterRotate = false
            console.log(player.assetPileCards.length%2)
            if(player.assetPileCards.length%2 != 0){
                alterRotate = true
            }
            
            if(player.assetPileCards.length%2 != 0 && this.addingTempCard){
                alterRotate = false
            }
            else if(player.assetPileCards.length%2 == 0 && this.addingTempCard){
                alterRotate = true
            }
            console.log(alterRotate)
            var positionId = player.id
            var elementId = "cardMoveFromDiscardToAsset-" + (positionId)
            var timer = 10

            setTimeout(function () {
                if(alterRotate){
                    coverYourAssets.setElementClassName(elementId, "cardFromDiscardToAsset" + positionId + "_2 dealCard")
                }
                else{
                    coverYourAssets.setElementClassName(elementId, "cardFromDiscardToAsset" + positionId + " dealCard")
                }
            }, timer)

            setTimeout(function () {
                coverYourAssets.setElementClassName(elementId, "displayNone")
                coverYourAssets.moveCardDiscardToAsset = false
            }, timer + this.timePerDraw)

        },

        moveCardFromHandToDiscard(player, card) {
            var positionId = player.id
            var elementId = "cardMoveFromHandToDiscard-" + (positionId)
            var timer = 10

            setTimeout(function () {
                document.getElementById(elementId).className = "cardFromHandToDiscard" + positionId + " dealCard"
            }, timer)

            setTimeout(function () {
                coverYourAssets.addCardToDiscardPile(card)
                document.getElementById(elementId).className = "displayNone"

                coverYourAssets.moveCardHandToDiscard = false

            }, timer + this.timePerDraw)
        },

        takeTurn() {
            var currentComputer = this.getCurrentPlayer()
            
            if(this.playerHasNoCardsLeft(currentComputer)){
                this.endTurn()
            }
            else{
                this.computerTakesTurn(currentComputer)
            }
        },
        
        easyComputerTurn(currentComputer, playerOptions){
            if(playerOptions.includes("match_challenge")){
                if(this.getRandomChance(20)){
                    var bestValueChallenge = this.getBestValueAndBestChanceChallenges(currentComputer)[0]
                    this.turnOptionChallengeOtherPlayer(currentComputer, bestValueChallenge)
                }
            }
            //## MUST ADD SEPARATION OR MIGHT TAKE TWO TURNS
            
            if (playerOptions.includes("match_hand")) {
                this.turnOptionMatchInHand(currentComputer)
            } else if (playerOptions.includes("match_discard")) {
                this.turnOptionMatchWithDiscard(currentComputer)
            } 
        },
        
        mediumComputerTurn(currentComputer, playerOptions){
            if(playerOptions.includes("match_challenge")){
                if(this.getRandomChance(75)){
                    var bestChanceChallenge = this.getBestValueAndBestChanceChallenges(currentComputer)[1]
                    this.turnOptionChallengeOtherPlayer(currentComputer, bestChanceChallenge)
                }
            }
            //## MUST ADD SEPARATION OR MIGHT TAKE TWO TURNS
            
            if (playerOptions.includes("match_discard")) {
                this.turnOptionMatchWithDiscard(currentComputer)
            } 
            else if (playerOptions.includes("match_hand")) {
                this.turnOptionMatchInHand(currentComputer)
            } 
        },
        
        hardComputerTurn(currentComputer, playerOptions){
            if(playerOptions.includes("match_challenge")){
                this.determineWhichChallengeToTake(currentComputer)
            }
            //## MUST ADD SEPARATION OR MIGHT TAKE TWO TURNS
            if (playerOptions.includes("match_discard")) {
                this.turnOptionMatchWithDiscard(currentComputer)
            } 
            else if (playerOptions.includes("match_hand")) {
                this.turnOptionMatchInHand(currentComputer)
            } 
        },
        
        getComputerHighPercentChanceToChallenge(){
            return 90  
        },
        
        getComputerLowPercentChanceToChallenge(){
            return 30  
        },
        
        getBestValueAndBestChanceChallenges(currentComputer){
            var bestValueChallenge
            var bestChanceChallenge
            var highestNum = 0
            var highestValue = 0
            var potentialChallenges = this.getPotentialChallenges(currentComputer)
            
            for(var i = 0; i < potentialChallenges.length;i++){
                if(potentialChallenges[i].valueOfGroup > highestValue){
                    highestValue = potentialChallenges[i].valueOfGroup
                    bestValueChallenge = potentialChallenges[i]
                }

                if(potentialChallenges[i].numCards){
                    highestNum = potentialChallenges[i].numCards
                    bestChanceChallenge = potentialChallenges[i]
                }
            }
            
            return [bestValueChallenge, bestChanceChallenge]
        },
        
        determineWhichChallengeToTake(currentComputer){
            var bestValueChallenge = this.getBestValueAndBestChanceChallenges(currentComputer)[0]
            var bestChanceChallenge = this.getBestValueAndBestChanceChallenges(currentComputer)[1]


            if(bestChanceChallenge == bestValueChallenge){
                if(potentialChallenges[i].valueOfGroup > this.computerCompeteIfPrice && highestNum && potentialChallenges[i].numCards > 1){
                    this.turnOptionChallengeOtherPlayer(currentComputer, bestChanceChallenge)
                }
            }
            else{
                if(bestChanceChallenge.numCards > 1){
                    if(this.getRandomChance(this.getComputerHighPercentChanceToChallenge())){
                        console.log("Best chance challenge only")
                        this.turnOptionChallengeOtherPlayer(currentComputer, bestChanceChallenge)
                    }
                }
                else if(bestValueChallenge.valueOfGroup > this.computerCompeteIfPrice){
                    if( this.getRandomChance( this.getComputerHighPercentChanceToChallenge() ) ){
                        console.log("Best value challenge only")
                        this.turnOptionChallengeOtherPlayer(currentComputer, bestChanceChallenge)
                    }
                }
                else{
                    if( this.getRandomChance( this.getComputerLowPercentChanceToChallenge() ) ){
                        console.log("30% chance to challenge")
                        this.turnOptionChallengeOtherPlayer(currentComputer)
                    }
                }
            }
        },
        
        playerTakesOnlyTurnPossible(currentComputer, playerOptions){
            if (playerOptions.includes("match_discard")) {
                this.turnOptionMatchWithDiscard(currentComputer)
            } else if (playerOptions.includes("match_hand")) {
                this.turnOptionMatchInHand(currentComputer)
            } else if (playerOptions.includes("match_challenge")) {
                this.turnOptionChallengeOtherPlayer(currentComputer)
            } 
        },
        
        computerTakesTurn(currentComputer){
            
            var playerOptions = this.getPlayerTurnOptions(currentComputer)
            console.log("PLAYER OPTIONS")
            console.dir(playerOptions)
            
            if(playerOptions.length == 0){
                this.turnOptionDiscard(currentComputer)
            }
            else if(playerOptions.length == 1){
                this.playerTakesOnlyTurnPossible(currentComputer, playerOptions)
            }
            else{
                switch(this.game.computerDifficulty){
                    case "Easy":
                        this.easyComputerTurn(currentComputer, playerOptions)
                        break;
                    case "Medium":
                        this.mediumComputerTurn(currentComputer, playerOptions)
                        break;
                    case "Hard":
                        this.hardComputerTurn(currentComputer, playerOptions)
                        break;
                    case "Cheater":
                        this.mediumComputerTurn(currentComputer, playerOptions)
                        break;
                    default:
                        console.error("COMPUTER DIFFICULTY NOT FOUND")
                        break;
                }
            }
        },
        
        getRandomChance(percent){
            var randomNum = Math.floor(Math.random() * 100) + 1
            if(randomNum <= percent){
                return true
            }
            else{
                return false
            }
        },
        
        getPlayerTurnOptions(player){
            var playerOptions = []
            
            if (this.playerHasMatchWithDiscardPile(currentComputer)) {
                playerOptions.push("match_discard")
            }
            
            if (this.playerHasMatchInHand(currentComputer)) {
                playerOptions.push("match_hand")
            }
            
            if (this.playerHasMatchWithChallenge(currentComputer)) {
                playerOptions.push("match_challenge")
            }
            
            return playerOptions
        },
        
        turnOptionChallengeOtherPlayer(currentComputer, challengeInfo) {

        },
        
        playerHasMatchWithChallenge(currentComputer){
            var potentialChallenges = this.getPotentialChallenges(currentComputer)
            
            if(potentialChallenges.length != 0){
                console.log("player can challenge: ")
                console.dir(potentialChallenges)
                return true
            }
            else{
                console.log("player cannot challenge")
                return false
            }
        },
        
        getPotentialChallenges(player){
            var potentialChallenges = []
            
            for(var j = 0; j < this.game.players.length; j++){
                if(this.game.players[j].id != player.id && this.game.players[j].assetPileCards.length > 1){
                    var numCards = 0
                    
                    for(var i = 0; i < player.cardsInHand.length; i++){
                        if(player.cardsInHand[i].id == this.getTopCardOnAssetPile(this.game.players[j]).id || this.cardIsWild(player.cardsInHand[i])){
                            numCards++
                        }
                    }
                    
                    if(numCards > 0){
                        potentialChallenges.push(
                            {
//                                playerId: this.game.players[j].id, 
//                                cardId: this.getTopCardOnAssetPile(this.game.players[j]).id,
                                player: this.game.players[j], 
                                card: this.getTopCardOnAssetPile(this.game.players[j]),
                                valueOfGroup: this.getTopGroupOnAssetPileValue(this.game.players[j]),
                                numCards: numCards
                            }
                        )
                    }
                }
            }
            
            return potentialChallenges
        },

        turnOptionMatchWithDiscard(currentComputer) {
            console.log("computer matched with discard pile")
            var cards = []
            var card = this.getParsedObject(this.getTopCardOnDiscardPile())
            cards.push(card)
            cards.push(card)

            this.topCardOnDiscardBeforeRemoval = this.getTopCardOnDiscardPile()
            this.cardMovingFromHand = this.getTopCardOnDiscardPile()
            this.removeCardFromPlayersHandBasedOnIndex(currentComputer, this.getCardIndexInHand(currentComputer, this.getTopCardOnDiscardPile()))
            this.removeTopCardFromDiscard()

            this.moveCardFromHandToAssets(currentComputer)
            this.moveCardFromDiscardToAssets(currentComputer)

            setTimeout(function () {
                coverYourAssets.addCardsToPlayerAssets(currentComputer, cards)
                coverYourAssets.dealIndividualCard(currentComputer, 1)
            }, this.timePerDraw)
        },

        turnOptionMatchInHand(currentComputer) {
            var cards
            if (!this.playerHasWild(currentComputer)) {
                console.log(currentComputer.name + " has a match without wild")
                cards = this.getPlayerCardMatchInHand(currentComputer)
            } else {
                console.log(currentComputer.name + " has a match with wild")
                cards = this.getPlayerCardMatchInHandWithWild(currentComputer)
            }

            this.cardMovingFromHand = cards[1]
            this.removeCardFromPlayersHandBasedOnIndex(currentComputer, this.getCardIndexInHand(currentComputer, cards[1]))
            this.moveCardFromHandToAssets(currentComputer)

            setTimeout(function () {
                coverYourAssets.addTempCardToPlayerAssets(currentComputer, coverYourAssets.cardMovingFromHand)
                coverYourAssets.cardMovingFromHand = cards[0]
                coverYourAssets.removeCardFromPlayersHandBasedOnIndex(currentComputer, coverYourAssets.getCardIndexInHand(currentComputer, cards[0]))
                coverYourAssets.moveCardFromHandToAssets(currentComputer)
            }, this.timePerDraw + 20)

            setTimeout(function () {
                coverYourAssets.addCardsToPlayerAssets(currentComputer, cards)
                coverYourAssets.dealIndividualCard(currentComputer, 2)
            }, (this.timePerDraw * 2) + 20)
        },

        turnOptionDiscard(currentComputer) {
            console.log(currentComputer.name + " is discarding")
            var card = this.getPlayerLowestValueCard(currentComputer)
            this.cardMovingFromHand = card
            this.moveCardHandToDiscard = true
            this.computerDiscards(currentComputer, this.getCardIndexInHand(currentComputer, card), card)

            this.moveCardFromHandToDiscard(currentComputer, card)

            setTimeout(function () {
                coverYourAssets.dealIndividualCard(currentComputer, 1)
            }, this.timePerDraw)
        },

        getPlayerCardMatchInHand(player) {
            var cards = []
            var cardIds = []

            for (var i = 0; i < player.cardsInHand.length; i++) {
                if (!this.cardIsWild(player.cardsInHand[i])) {
                    if (cardIds.includes(player.cardsInHand[i].id)) {
                        cards.push(player.cardsInHand[i])
                        cards.push(player.cardsInHand[i])
                        break
                    } else {
                        cardIds.push(player.cardsInHand[i].id)
                    }
                }
            }

            return cards
        },

        getPlayerCardMatchInHandWithWild(player) {
            var cards = []

            cards.push(this.getPlayerHighestValueNonWildCard(player))
            cards.push(this.getPlayerHighestValueCard(player))

            return cards
        },

        getTopCardOnDiscardPile() {
            return this.game.discardPile[this.game.discardPile.length - 1]
        },

        playerHasMatchWithDiscardPile(player) {
            if (this.game.discardPile.length != 0) {
                var topOfDiscard = this.getTopCardOnDiscardPile()
                if (this.cardIsWild(topOfDiscard)) {
                    return false
                }

                for (var i = 0; i < player.cardsInHand.length; i++) {
                    if (player.cardsInHand[i].id == topOfDiscard.id) {
                        return player.cardsInHand[i]
                    }
                }

                return false
            } else {
                return false
            }

        },

        playerHasMatchInHand(player) {
            if (this.playerHasAtLeastOneNonWild(player)) {
                if (this.playerHasTwoSameCards(player)) {
                    return true
                } else if (this.playerHasWild(player)) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        },

        getCardIndexInHand(player, card) {
            for (var i = 0; i < player.cardsInHand.length; i++) {
                if (player.cardsInHand[i].id == card.id) {
                    return i
                }
            }
        },

        playerHasAtLeastOneNonWild(player) {
            for (var i = 0; i < player.cardsInHand.length; i++) {
                if (!this.cardIsWild(player.cardsInHand[i])) {
                    return true
                }
            }
            return false
        },

        playerHasTwoSameCards(player) {
            var cardIds = []

            for (var i = 0; i < player.cardsInHand.length; i++) {
                if (!this.cardIsWild(player.cardsInHand[i])) {
                    if (cardIds.includes(player.cardsInHand[i].id)) {
                        return true
                    } else {
                        cardIds.push(player.cardsInHand[i].id)
                    }
                }
            }

            return false
        },

        playerHasWild(player) {
            for (var i = 0; i < player.cardsInHand.length; i++) {
                if (this.cardIsWild(player.cardsInHand[i])) {
                    return true
                }
            }
            return false
        },

        getPlayerLowestValueCard(player) {
            var lowestValue = 1000000
            var lowestCard

            for (var i = 0; i < player.cardsInHand.length; i++) {
                if (player.cardsInHand[i].price < lowestValue) {
                    lowestValue = player.cardsInHand[i].price
                    lowestCard = player.cardsInHand[i]
                }
            }
            return lowestCard
        },

        getPlayerHighestValueCard(player) {
            var highestValue = 0
            var highestCard

            for (var i = 0; i < player.cardsInHand.length; i++) {
                if (player.cardsInHand[i].price > highestValue) {
                    highestValue = player.cardsInHand[i].price
                    highestCard = player.cardsInHand[i]
                }
            }
            return highestCard
        },

        getPlayerHighestValueNonWildCard(player) {
            var highestValue = 0
            var highestCard

            for (var i = 0; i < player.cardsInHand.length; i++) {
                if (!this.cardIsWild(player.cardsInHand[i])) {
                    if (player.cardsInHand[i].price > highestValue) {
                        highestValue = player.cardsInHand[i].price
                        highestCard = player.cardsInHand[i]
                    }
                }
            }
            return highestCard
        },

        incrementTurn() {
            if (this.game.playerTurn == 3) {
                this.game.playerTurn = 0
            } else {
                this.game.playerTurn++
            }
        },

        moveCardFromDeckToDiscard() {
            this.addCardToDiscardPile(this.getTopCardOnDeck())
            this.removeTopCardFromDeck()
        },

        createPlayers() {
            var player1 = this.getParsedObject(this.basePlayer)
            this.typedName == "" ? player1.name = "Player 1" : player1.name = this.typedName
            this.addPlayerToGame(player1)

            var computer;
            for (var i = 0; i < 3; i++) {
                computer = this.getParsedObject(this.basePlayer)
                computer.id = (i + 2)
                computer.computer = true
                if (i == 0) {
                    computer.name = "Blue"
                } else if (i == 1) {
                    computer.name = "Green"
                } else {
                    computer.name = "Red"
                }

                this.addPlayerToGame(computer)
            }
        },

        addPlayerToGame(player) {
            this.game.players.push(player)
        },

        drawCard(player, card) {
            for (var i = 0; i < this.game.players.length; i++) {
                if (this.game.players[i].id == player.id) {
                    this.game.players[i].cardsInHand.push(card)
                }
            }
        },

        dealCardsToPlayers() {
            if (this.testing) {
                this.game.players[0].cardsInHand.push(this.cards[3])
                this.game.players[0].cardsInHand.push(this.cards[3])
                this.game.players[0].cardsInHand.push(this.cards[2])
                this.game.players[0].cardsInHand.push(this.cards[11])
            } else {
                for (var i = 0; i < 16; i++) {
                    var timer = (i * this.timePerDrawInitialDeal)

                    setTimeout(function () {
                        var myPlayerPosition = coverYourAssets.playerPosition
                        coverYourAssets.drawCard(coverYourAssets.game.players[myPlayerPosition], coverYourAssets.getTopCardOnDeck())
                        coverYourAssets.removeTopCardFromDeck()
                        coverYourAssets.playerPosition == 3 ? coverYourAssets.playerPosition = 0 : coverYourAssets.playerPosition++
                    }, timer)

                }
            }
        },

        removeTopCardFromDeck() {
            this.game.deck.pop()
        },

        removeTopCardFromDiscard() {
            this.game.discardPile.pop()
        },

        getTopCardOnDeck() {
            return this.game.deck[this.game.deck.length - 1]
        },

        addCardToDiscardPile(card) {
           this.game.discardPile.push(card)
        },

        initLocalStorageObject() {
            if (!this.getLocalStorageObject(this.newGame.name)) {
                this.setLocalStorageObject(this.newGame.name, this.newGame)
            }
            else{
                this.hasPreviousGame = true
            }
        },

        initDeck() {
            if (this.testing) {
                for (var i = 0; i < 2; i++) {
                    for (var j = 0; j < this.cards[i].quantity; j++) {
                        this.game.deck.push(this.getParsedObject(this.cards[i]))
                    }
                }
            } else {
                for (var i = 0; i < this.cards.length; i++) {
                    for (var j = 0; j < this.cards[i].quantity; j++) {
                        this.game.deck.push(this.getParsedObject(this.cards[i]))
                    }
                }
            }

            this.shuffleArray(this.game.deck)
        },

        getParsedObject(object) {
            return JSON.parse(JSON.stringify(object))
        },

        resumeGame() {
            var game = this.getLocalStorageObject(this.game.name)
            if (game.newGame) {
                this.game = this.newGame
                this.game.id = (game.id + 1)
            } else {
                this.game = game
            }

        },

        getLocalStorageObject(objectName) {
            return JSON.parse(localStorage.getItem(objectName));
        },

        setLocalStorageObject(objectName, object) {
            localStorage.setItem(objectName, JSON.stringify(object));
        },

        startGame() {
            this.cardsDealt = true
            this.saveGame()
        },

        prepareGame() {
            this.game = this.getParsedObject(this.newGame)
            this.initDeck()
        },

        setGameStart(bool) {
            this.game.gameStart = bool
        },

        saveGame() {
            this.setLocalStorageObject(this.game.name, this.game)
        },

        startNewGame() {
            this.game.newGame = true
            this.hasPreviousGame = false
            this.saveGame()
            this.pageRefresh()
        },

        shuffleArray(array) {
            var currentIndex = array.length,
                temporaryValue, randomIndex;

            while (0 !== currentIndex) {

                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
        },

        getToOrFromCardId(cardHtmlId) {
            return cardHtmlId.split("-")[0]
        },

        addClassToElementById(id, myClass) {
            document.getElementById(id).classList.add(myClass)
        },

        removeClassToElementById(id, myClass) {
            document.getElementById(id).classList.remove(myClass)
        },

        removeCardFromPlayersHandBasedOnIndex(player, cardIndex) {
            this.removeIndexFromArray(player.cardsInHand, cardIndex)
        },

        getCurrentPlayer() {
            return this.game.players[this.game.playerTurn]
        },

        getCardFromId(id) {
            for (var i = 0; i < this.cards.length; i++) {
                if (this.cards[i].id == id) {
                    return this.cards[i]
                }
            }
        },

        playerDiscards(player, cardIndex, card) {
            this.removeCardFromPlayersHandBasedOnIndex(player, cardIndex)
            this.addCardToDiscardPile(card)
        },
        
        computerDiscards(player, cardIndex, card) {
            this.removeCardFromPlayersHandBasedOnIndex(player, cardIndex)
        },

        getPlayersCurrentWealth(player) {
            var total = 0
            for (var i = 0; i < player.assetPileCards.length; i++) {
                for (var j = 0; j < player.assetPileCards[i].length; j++) {
                    total += player.assetPileCards[i][j].price
                }
            }
            player.currentWealth = total
            return total
        },

        convertWealth(wealth) {
            if (wealth > 0) {
                return (wealth / 1000) + "k"
            } else {
                return 0
            }
        },

        getArrayWithElementRemoved(array, valueToRemove) {
            var index = array.indexOf(valueToRemove);
            if (index > -1) {
                array.splice(index, 1)
            }

            return array;
        },

        removeIndexFromArray(array, index) {
            if (index > -1) {
                array.splice(index, 1)
            }
        },

        addCardsToPlayerAssets(player, cards) {
            
            if(player.assetPileCards.length > 0){
                this.clearTempCardInPlayerAssets(player)
            }
            
            var newGroup = cards
            var firstCard = cards[0]
            
            if(this.cardIsWild(firstCard)){
                newGroup = this.getGroupWithFirstCardOfAssetGroupAsNonWild(newGroup)
            }

            player.assetPileCards.push(newGroup)
        },
    
        getGroupWithFirstCardOfAssetGroupAsNonWild(cards){
            var newGroup = cards
            var topCard
            var i
            
            for(i = 0; i < cards.length;i++){
                if(!this.cardIsWild(cards[i])){
                    topCard = cards[i]
                    break
                }
            }
            
            this.removeIndexFromArray(newGroup, i)
            
            newGroup.unshift(topCard)

            return newGroup
        },
        
        addTempCardToPlayerAssets(player, card){
            this.addingTempCard = true
            var newGroup = []
            newGroup.push(card)

            player.assetPileCards.push(newGroup) 
        },
        
        clearTempCardInPlayerAssets(player){
            if(player.assetPileCards[player.assetPileCards.length-1].length == 1){
                player.assetPileCards.pop()
                this.addingTempCard = false
            }  
        },

        cardIsWild(card) {
            if (card.id == 11 || card.id == 12) {
                return true
            } else {
                return false
            }
        },

        getCardFromHtmlId(htmlId) {
            return this.getCardFromId(this.getToOrFromCardId(htmlId))
        },

        playerDrawCard(player) {
            player.cardsInHand.push(this.getTopCardOnDeck())
            this.removeTopCardFromDeck()
        },

        checkForCombiningCards() {
            if (this.draggedCard != this.droppedOnCard) {
                if (this.cardIsValid(this.draggedCard, this.droppedOnCard)) {
                    var cards = [this.draggedCard, this.droppedOnCard]
                    this.addCardsToPlayerAssets(this.getCurrentPlayer(), cards)

                    if (this.draggingFromDiscard) {
                        this.removeTopCardFromDiscard()
                        this.removeCardFromPlayersHandBasedOnIndex(this.getCurrentPlayer(), this.dragOverCardIndex)
                        this.dealIndividualCard(this.getCurrentPlayer(), 1)
                    } else {
                        if (this.draggedCardIndex > this.dragOverCardIndex) {
                            this.removeCardFromPlayersHandBasedOnIndex(this.getCurrentPlayer(), this.draggedCardIndex)
                            this.removeCardFromPlayersHandBasedOnIndex(this.getCurrentPlayer(), this.dragOverCardIndex)
                        } else {
                            this.removeCardFromPlayersHandBasedOnIndex(this.getCurrentPlayer(), this.dragOverCardIndex)
                            this.removeCardFromPlayersHandBasedOnIndex(this.getCurrentPlayer(), this.draggedCardIndex)
                        }
                        this.dealIndividualCard(this.getCurrentPlayer(), 2)
                    }
                }
                else{
                    this.showHintPopup("You can only make a group with the same cards or with 1 Gold/Silver.")
                }
            }
        },

        cardsAreTheSame(fromCard, toCard) {
            if (fromCard.id == toCard.id) {
                return true
            } else {
                return false
            }
        },

        cardsBothWilds(fromCard, toCard) {
            if (this.cardIsWild(toCard) && this.cardIsWild(fromCard)) {
                return true
            } else {
                return false
            }
        },

        oneCardIsWild(fromCard, toCard) {
            if (this.cardIsWild(toCard) && !this.cardIsWild(fromCard) ||
                !this.cardIsWild(toCard) && this.cardIsWild(fromCard)) {
                return true
            } else {
                return false
            }
        },

        cardIsValid(fromCard, toCard) {
            if ((this.cardsAreTheSame(fromCard, toCard) && !this.cardsBothWilds(fromCard, toCard)) ||
                this.oneCardIsWild(fromCard, toCard)) {
                return true
            } else {
                return false
            }
        },

        getElHtmlId(card, index) {
            return card.id + "-" + index
        },
        
        challengedPlayerAutoLoses(challengedPlayer, currentPlayer){
            challengedPlayer.challengedCards.push(this.draggedCard)
            this.removeCardFromPlayersHandBasedOnIndex(currentPlayer, this.draggedCardIndex)
            this.endChallenge(currentPlayer, challengedPlayer) 
        },
        
        contestChallengeWithCardInHand(challengedPlayer, currentPlayer){
            console.log("contesting challenge with card from hand")
            this.removeCardFromPlayersHandBasedOnIndex(challengedPlayer, this.getCardIndexInHand(challengedPlayer, this.getTopCardOnAssetPile(challengedPlayer)))
            challengedPlayer.challengedCards.push(this.getTopCardOnAssetPile(challengedPlayer))
            this.dealIndividualCard(challengedPlayer, 1)
            this.setTurnBackToChallenger(currentPlayer)
        },
        
        contestChallengeWithWildInHand(challengedPlayer, currentPlayer){
            //depending on strat or cost of pile, either play it or give it
            if(this.getChallengedCardsValue(challengedPlayer) > this.computerCompeteIfPrice){
                console.log("contesting challenge with wild from hand")
                var highestCard = this.getPlayerHighestValueCard(challengedPlayer)
                
                this.removeCardFromPlayersHandBasedOnIndex(challengedPlayer, this.getCardIndexInHand(challengedPlayer, highestCard))
                challengedPlayer.challengedCards.push(highestCard)
                this.dealIndividualCard(challengedPlayer, 1)
                this.setTurnBackToChallenger(currentPlayer)
            }
            else{
                console.log("giving up on challenge")
                this.endChallenge(currentPlayer, challengedPlayer)
            }
        },
        
        challengePlayer(challengedPlayer, currentPlayer, draggedCard) {
            this.currentChallengedPlayer = challengedPlayer
            this.currentChallengerPlayer = currentPlayer
            if(this.playerHasNoCardsLeft(challengedPlayer)){
                this.challengedPlayerAutoLoses(challengedPlayer, currentPlayer)
            }
            else{
                this.challengeActive = true
                challengedPlayer.challengedCards.push(this.draggedCard)
                this.removeCardFromPlayersHandBasedOnIndex(currentPlayer, this.draggedCardIndex)
                this.dealIndividualCard(currentPlayer, 1)
                challengedPlayer.computerThinking = true
                this.game.playerTurn = challengedPlayer.id - 1
                
                setTimeout(function () {
                    if (coverYourAssets.canPlayerRespondToChallenge(challengedPlayer, currentPlayer) == 1) {
                        coverYourAssets.contestChallengeWithCardInHand(challengedPlayer, currentPlayer)
                    }
                    else if(coverYourAssets.canPlayerRespondToChallenge(challengedPlayer, currentPlayer) == 2){
                        coverYourAssets.contestChallengeWithWildInHand(challengedPlayer, currentPlayer)
                    }
                    else {
                        console.log("cant contest challenge")
                        coverYourAssets.endChallenge(currentPlayer, challengedPlayer)

                    }
                    challengedPlayer.computerThinking = false
                }, this.timeForComputerToThink)
            }
        },
        
        getChallengedCardsValue(challengedPlayer) {
            var total = 0
            
            for(var i = 0; i < challengedPlayer.challengedCards.length;i++){
                total += challengedPlayer.challengedCards[i].price
            }
            
            total += this.getTopGroupOnAssetPileValue(challengedPlayer)
            
            return total
        },
        
        getTopGroupOnAssetPileValue(player){
            var total
            for (var j = 0; j < player.assetPileCards[player.assetPileCards.length - 1].length; j++) {
                total += player.assetPileCards[player.assetPileCards.length - 1][j].price
            } 
            
            return total
        },
        
        setTurnBackToChallenger(currentPlayer){
            this.game.playerTurn = currentPlayer.id - 1  
        },

        getTopGroupOnAssetPile(player) {
            return player.assetPileCards[player.assetPileCards.length - 1]
        },

        removeTopGroupFromAssetPile(player) {
            player.assetPileCards.pop()
        },
        
        endChallenge(winner, challengedPlayer){
            console.log(winner.name + " won the challenge!")
            var winnerName
            if(winner.computer){
                this.showHintPopup(winner.name + " won the challenge!")
            }
            else{
                this.showHintPopup("You won the challenge!")
            }
            
            this.challengeActive = false
            const cards = []
            for (var i = 0; i < challengedPlayer.challengedCards.length; i++) {
                cards.push(challengedPlayer.challengedCards[i])
            }
            for (var i = 0; i < this.getTopGroupOnAssetPile(challengedPlayer).length; i++) {
                cards.push(this.getTopGroupOnAssetPile(challengedPlayer)[i])
            }
            this.removeTopGroupFromAssetPile(challengedPlayer)
            challengedPlayer.challengedCards.length = 0
            this.addCardsToPlayerAssets(winner, cards)
            
            this.setTurnBackToChallenger(this.currentChallengerPlayer)
            this.endTurn()
        },
        
        giveUpChallenge(){
            this.endChallenge(this.currentChallengedPlayer, this.currentChallengedPlayer)
        },

        canPlayerRespondToChallenge(challengedPlayer, currentPlayer) {
            if (this.playerHasTopAssetPileCardInHand(challengedPlayer)) {
                return 1
            } else if (this.playerHasWild(challengedPlayer)) {
                return 2
            } else {
                return 0
            }
        },

        playerHasTopAssetPileCardInHand(challengedPlayer) {
            for (var i = 0; i < challengedPlayer.cardsInHand.length; i++) {
                if (this.getTopCardOnAssetPile(challengedPlayer).id == challengedPlayer.cardsInHand[i].id) {
                    return true
                }
            }
            return false
        },

        getTopCardOnAssetPile(player) {
            return player.assetPileCards[player.assetPileCards.length - 1][0]
        },

        addChallengeStyleOnHover(position) {
            document.getElementById('player' + position + 'ChallengeArea').style.border = '3px dashed #fff'
            document.getElementById('player' + position + 'ChallengeText').classList.remove('displayNone')
        },

        addBadChallengeStyleOnHover(position) {
            document.getElementById('player' + position + 'ChallengeArea').style.border = '3px dashed #d4080f'
        },

        removeChallengeStyleOnLeave(position) {
            document.getElementById('player' + position + 'ChallengeArea').style.border = 'none'
            document.getElementById('player' + position + 'ChallengeText').classList.add('displayNone')
        },

        /****** DRAG *****/
        dragStart(card, cardIndexInHand, ev) {
            this.draggingFromDiscard = false
            this.draggedCard = card
            this.draggedCardIndex = cardIndexInHand
        },

        dragStartFromDiscard(card, dragStartFromDiscardindex, ev) {
            this.draggingFromDiscard = true
            this.draggedCard = card
            this.draggedCardIndex = 10
        },

        dropCardOnCard(card, dropCardOnCardIndex, ev) {
            if(!this.challengeActive){
                ev != false ? ev.preventDefault() : ''
                this.droppedOnCard = card
                this.removeClassToElementById(this.getElHtmlId(card, dropCardOnCardIndex), "hoveredHandCard")
                this.removeClassToElementById(this.getElHtmlId(card, dropCardOnCardIndex), "hoveredHandCardMatch")
                this.removeClassToElementById(this.getElHtmlId(card, dropCardOnCardIndex), "hoveredHandCardNoMatch")

                this.checkForCombiningCards() 
            }
            
        },

        dragOverCard(card, dragOverCardIndex, ev) {
            if(!this.challengeActive){
                ev != false ? ev.preventDefault() : ''
                this.dragOverCardIndex = dragOverCardIndex

                if (this.dragOverCardIndex != this.draggedCardIndex) {
                    this.addClassToElementById(this.getElHtmlId(card, dragOverCardIndex), "hoveredHandCard")
                    if (this.cardIsValid(this.draggedCard, card)) {
                        this.addClassToElementById(this.getElHtmlId(card, dragOverCardIndex), "hoveredHandCardMatch")
                    } else {
                        this.addClassToElementById(this.getElHtmlId(card, dragOverCardIndex), "hoveredHandCardNoMatch")
                    }
                }
            }
            
        },

        dragLeaveOtherCard(card, leaveCardIndex, ev) {
            ev != false ? ev.preventDefault() : ''
            this.removeClassToElementById(this.getElHtmlId(card, leaveCardIndex), "hoveredHandCard")
            this.removeClassToElementById(this.getElHtmlId(card, leaveCardIndex), "hoveredHandCardMatch")
            this.removeClassToElementById(this.getElHtmlId(card, leaveCardIndex), "hoveredHandCardNoMatch")
        },


        dropDiscard(ev) {
            ev != false ? ev.preventDefault() : ''
            if (!this.draggingFromDiscard) {
                this.playerDiscards(this.getCurrentPlayer(), this.draggedCardIndex, this.draggedCard)
                this.dealIndividualCard(this.getCurrentPlayer(), 1)
            }
        },

        dragOverDiscard(ev) {
            ev.preventDefault()
        },

        dragLeaveDiscard(ev) {
            ev.preventDefault()
        },

        dragOverForChallenge(challengedPlayer, ev) {
            ev.preventDefault()
            var position = challengedPlayer.id
            
            if(!this.challengeActive || challengedPlayer.id == this.currentChallengedPlayer.id){
                if (challengedPlayer.assetPileCards.length > 1) {
                    if (!this.draggingFromDiscard) {
                        if (this.getTopCardOnAssetPile(challengedPlayer).id == this.draggedCard.id || this.cardIsWild(this.draggedCard)) {
                            this.addChallengeStyleOnHover(position)
                        } else {
                            this.addBadChallengeStyleOnHover(position)
                            this.showHintPopup("You can only challenge using the same card or using a wild.")
                        }
                    } else {
                        this.addBadChallengeStyleOnHover(position)
                        this.showHintPopup("You can't challenge using a card from the discard pile.")
                    }
                } else {
                    this.addBadChallengeStyleOnHover(position)
                    this.showHintPopup("You can't challenge unless the player has more than 1 group")
                }
            }
            else{
                this.showHintPopup("You are currently in the middle of a challenge with " + this.currentChallengedPlayer.name + "!")
            }
            

        },

        dragLeaveForChallenge(challengedPlayer, ev) {
            ev.preventDefault()
            var position = challengedPlayer.id

            this.removeChallengeStyleOnLeave(position)
        },

        dropForChallenge(challengedPlayer, ev) {
            ev.preventDefault()
            var position = challengedPlayer.id

            this.removeChallengeStyleOnLeave(position)

            if(!this.challengeActive || challengedPlayer.id == this.currentChallengedPlayer.id){
                if (challengedPlayer.assetPileCards.length > 1) {
                    if (!this.draggingFromDiscard) {
                        if (this.getTopCardOnAssetPile(challengedPlayer).id == this.draggedCard.id || this.cardIsWild(this.draggedCard)) {
                            this.challengePlayer(challengedPlayer, this.getCurrentPlayer(), this.draggedCard)
                        }
                    }
                }
            }
            else{
                this.showHintPopup("You are currently in the middle of a challenge with " + this.currentChallengedPlayer.name + "!")
            }
            
        },

        /***** /drag *****/
        
    },
    computed: {

    },
})
