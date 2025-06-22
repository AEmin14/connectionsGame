// For more information see https://aka.ms/fsharp-console-apps
open Elmish
open Elmish.React
open Feliz

let IDSEQ =
    seq {
        for i in 1..200000 do
            yield i
    }
    |> Seq.cache

let nextID =
    let enum = IDSEQ.GetEnumerator()

    let foo () =
        if enum.MoveNext() then
            enum.Current
        else
            failwith "No more ids."

    foo

type Card =
    { id: int
      image: string
      group : string
      selected: bool
      shake: bool
      guessed1: bool
      guessed2: bool
      guessed3: bool
      guessed4: bool
      shuffle : bool
      makeGroup : bool
      dontShow : bool 
    }

    static member makeCard(image: string, group:string) =

        { id = nextID ()
          image = image
          group = group
          selected = false
          shake = false
          shuffle = true
          guessed1 = false
          guessed2 = false
          guessed3 = false
          guessed4 = false
          makeGroup = false
          dontShow = false          
          }

type Game = { 
  cardsToGuess: Card list
  attemptsLeft:int
  showOneAway : bool
  itsOver : bool 
} 

type State =
    | Initial of Game
    | Guessed1 of Game
    | Guessed2 of Game
    | Guessed3 of Game
    | GameOver of Game
    | Guessed1Group of Game
    | Guessed2Group of Game
    | Guessed3Group of Game

type Message =
    | TileClick of Card
    | DeselectAll
    | DeselectAndShake
    | Shuffle
    | MakeGroup

let selectCard (card : Card) (cards : Card list) : Card list = 
  cards |> List.map (fun c ->if c.id = card.id then {c with selected= true} else c)

let selectnonguessed1 (card : Card) (cards : Card list) : Card list =
  cards |> List.map (fun c -> if c.id = card.id && card.guessed1 <> true then {c with selected = true} else c )
let selectnonguessed2 (card : Card) (cards : Card list) : Card list =
  cards |> List.map (fun c -> if c.id = card.id && card.guessed1 <> true && card.guessed2 <> true then {c with selected = true} else c )
let selectnonguessed3 (card : Card) (cards : Card list) : Card list =
  cards |> List.map (fun c -> if c.id = card.id && card.guessed1 <> true && card.guessed2 <> true && card.guessed3 <> true then {c with selected = true} else c )

let deselectCards (cards : Card list) : Card list = 
  cards |> List.map (fun c->{c with selected = false})

let shakeCard (cards : Card list) : Card list =
  let foo (c:Card) = if c.selected then {c with shake = true} else c
  cards |> List.map foo 
let unshakeCard (cards : Card list) : Card list =
  cards |> List.map (fun c -> {c with shake = false})
let countSelected (cards : Card list) : int =
  cards |> List.filter (fun c -> c.selected) |> List.length

let shuffleCards (cards :Card list) : Card list = 
  let rnd = System.Random()
  let toshuffle= cards |> List.filter (fun c -> c.shuffle = true)
  let g1 = cards |> List.filter (fun c -> c.guessed1) 
  let g2 = cards |> List.filter (fun c -> c.guessed2) 
  let g3 = cards |> List.filter (fun c -> c.guessed3) 
  let l1 = g1 @ g2 @ g3
  toshuffle |> List.sortBy (fun _ -> rnd.Next()) |> List.append l1


let wait4sec () = 
  async {
    do! Async.Sleep 4000
  }
let wait2sec () = 
  async {
    do! Async.Sleep 2000
  }
let wait1sec () = 
  async {
    do! Async.Sleep 1500
  }
let g1 = ["balkon.png"; "oil.png"; "bat.png" ; "ticket.png"]
let g2 = ["candle.png"; "clock.png"; "sunset.png" ; "old.png"]
let g3 = ["flag.png"; "chihiro.png"; "sam.png" ; "ramen.png"]
let g4 = ["cite.png"; "loc.png"; "sight.png" ; "site.png"]

let cards =
  (g1 |> List.map (fun img -> Card.makeCard(img, "Group1"))) @
  (g2 |> List.map (fun img -> Card.makeCard(img, "Group2"))) @
  (g3 |> List.map (fun img -> Card.makeCard(img, "Group3"))) @
  (g4 |> List.map (fun img -> Card.makeCard(img, "Group4")))


let init () : State * Cmd<'Msg> =
  
  Initial { cardsToGuess = (shuffleCards (shuffleCards cards)); attemptsLeft =4 ; showOneAway = false; itsOver = false},Cmd.none

let update (msg: Message) (state: State) : State * Cmd<'Msg> =
  match state with
  | Initial gameState ->
    match gameState.attemptsLeft with
    | 0 -> 
      let cmdShake () = DeselectAndShake
      GameOver {gameState with cardsToGuess = gameState.cardsToGuess; itsOver = true; showOneAway = false}, Cmd.OfAsync.perform wait1sec () cmdShake
    | _ -> 
      match msg with
      | TileClick (card) ->
        
        let newCards = selectCard card gameState.cardsToGuess
        if countSelected newCards < 4 then 
          Initial {gameState with cardsToGuess = newCards}, Cmd.none
        else  
          let selectedCards = newCards |> List.filter (fun c -> c.selected)
          let hgroup = selectedCards.Head.group
          
          if selectedCards |> List.forall (fun c -> c.group = hgroup) then 
          
            let guessed = selectedCards |> List.map (fun c -> {c with guessed1=true ; shuffle = false} )            

            let nonselected= newCards |> List.filter (fun c -> c.selected= false)
            let goodGuess1 = List.append guessed nonselected
            let cmdDeselect () = MakeGroup 
            Guessed1Group{gameState with cardsToGuess = goodGuess1; }, Cmd.OfAsync.perform wait1sec () cmdDeselect
          
          else
            let cmdShake () = DeselectAndShake 
            let checkGuesses = selectedCards |> List.filter (fun c -> c.group = hgroup)
            let shakenCards = shakeCard newCards 
            if checkGuesses.Length < 3 then
              Initial {gameState with cardsToGuess = shakenCards; attemptsLeft = gameState.attemptsLeft - 1}, Cmd.OfAsync.perform wait2sec () cmdShake
            else 
              Initial {gameState with cardsToGuess = shakenCards; attemptsLeft =gameState.attemptsLeft - 1; showOneAway = true},Cmd.OfAsync.perform wait2sec () cmdShake

      | Shuffle ->
        let shuffledCards = shuffleCards gameState.cardsToGuess 
        Initial {gameState with cardsToGuess= shuffledCards}, Cmd.none  
        
      | DeselectAll ->
        let newCards = gameState.cardsToGuess |> deselectCards
        Initial {gameState with cardsToGuess = newCards}, Cmd.none

      | DeselectAndShake->
        let newCards = gameState.cardsToGuess |> unshakeCard |> deselectCards  
        Initial {gameState with cardsToGuess = newCards; showOneAway = false}, Cmd.none

      | _ -> state, Cmd.none

  | Guessed1Group gameState ->
    match msg with
    | MakeGroup ->
      let cmdDeselect () = DeselectAll
      Guessed1Group gameState, Cmd.OfAsync.perform wait1sec () cmdDeselect
    | _ ->
      let head = gameState.cardsToGuess |> List.filter (fun c -> c.guessed1) |> List.head
      let notguessed = gameState.cardsToGuess |> List.filter (fun c -> c.guessed1=false)
      let group = gameState.cardsToGuess |> List.filter (fun c ->c.group = head.group)
      let firstCard = 
        group 
        |> List.mapi (fun i c ->
          if i =0 then {c with dontShow = false; makeGroup = true} else {c with dontShow = true; makeGroup = true })
      let cmdDeselect () = DeselectAll
      Guessed1 {gameState with cardsToGuess = firstCard @ shuffleCards notguessed}, Cmd.OfAsync.perform wait1sec () cmdDeselect


  | Guessed1 gameState ->
    match gameState.attemptsLeft with
    | 0 -> 
      let cmdShake () = DeselectAndShake
      GameOver {gameState with cardsToGuess = gameState.cardsToGuess ; itsOver = true ; showOneAway = false}, Cmd.OfAsync.perform wait1sec () cmdShake
    | _ ->
      match msg with 
      | TileClick card ->
        let newCards = selectnonguessed1 card gameState.cardsToGuess 
        if countSelected newCards < 4 then 
          Guessed1 {gameState with cardsToGuess = newCards}, Cmd.none
        else 
          let selectedCards = newCards |> List.filter (fun c -> c.selected)
          let hgroup = selectedCards.Head.group
          if selectedCards |> List.forall (fun c -> c.group = hgroup) then
            let guessed1 =  newCards |> List.filter (fun c -> c.guessed1 = true)
            let guessed2 =  selectedCards |> List.map (fun c -> {c with guessed2 = true; shuffle = false})
            let nonselected = newCards |> List.filter (fun c -> c.guessed1 = false && c.guessed2 = false && c.selected = false)
            let g1 = List.append guessed1 guessed2 
            let goodGuess2 = List.append g1 nonselected 
            let cmdDeselect () = MakeGroup 
            Guessed2Group {gameState with cardsToGuess = goodGuess2}, Cmd.OfAsync.perform wait1sec () cmdDeselect
          else 
            let cmdShake () = DeselectAndShake
            let checkGuesses = selectedCards |> List.filter (fun c -> c.group = hgroup)
            let shakenCards = shakeCard newCards 
            if checkGuesses.Length < 3 then 
              Guessed1 {gameState with cardsToGuess = shakenCards; attemptsLeft = gameState.attemptsLeft - 1}, Cmd.OfAsync.perform wait2sec () cmdShake 
            else 
              Guessed1 {gameState with cardsToGuess = shakenCards; attemptsLeft =gameState.attemptsLeft - 1 ; showOneAway = true}, Cmd.OfAsync.perform wait2sec () cmdShake
    
      | Shuffle ->
        let shuffledCards = shuffleCards gameState.cardsToGuess 
        Guessed1 {gameState with cardsToGuess= shuffledCards}, Cmd.none  

      | DeselectAll ->
        let newCards = gameState.cardsToGuess |> deselectCards 
        Guessed1 {gameState with cardsToGuess = newCards}, Cmd.none
    
      | DeselectAndShake->
        let newCards = gameState.cardsToGuess |> deselectCards |> unshakeCard 
        Guessed1 {gameState with cardsToGuess = newCards ; showOneAway = false}, Cmd.none

      | _ -> state, Cmd.none
  
  | Guessed2Group gameState ->
    match msg with
    | MakeGroup ->
      let cmdDeselect () = DeselectAll
      Guessed2Group gameState, Cmd.OfAsync.perform wait1sec () cmdDeselect
    | _ ->
      let first = gameState.cardsToGuess |> List.filter (fun c -> c.guessed1)
      let head = gameState.cardsToGuess |> List.filter (fun c -> c.guessed2) |> List.head
      let notguessed = gameState.cardsToGuess |> List.filter (fun c -> c.guessed1=false && c.guessed2=false)
      let group = gameState.cardsToGuess |> List.filter (fun c ->c.group = head.group)
      let firstCard = 
        group 
        |> List.mapi (fun i c ->
          if i =0 then {c with dontShow = false; makeGroup = true} else {c with dontShow = true; makeGroup = true })
      let cmdDeselect () = DeselectAll
      Guessed2 {gameState with cardsToGuess = first @ firstCard @ shuffleCards notguessed}, Cmd.OfAsync.perform wait1sec () cmdDeselect

  | Guessed2 gameState -> 
    match gameState.attemptsLeft with
    | 0 -> 
      let cmdShake () = DeselectAndShake
      GameOver {gameState with cardsToGuess = gameState.cardsToGuess ; itsOver = true ; showOneAway = false}, Cmd.OfAsync.perform wait1sec () cmdShake
    | _ -> 
      match msg with 
      | TileClick card ->
        let newCards = selectnonguessed2 card gameState.cardsToGuess
        if countSelected newCards < 4 then 
          Guessed2 {gameState with cardsToGuess = newCards}, Cmd.none
        else 
          let selectedCards = newCards |> List.filter (fun c -> c.selected)
          let hgroup = selectedCards.Head.group
          if selectedCards |> List.forall (fun c -> c.group = hgroup) then
            let guessed1 =  newCards |> List.filter (fun c -> c.guessed1 = true)
            let guessed2 =  newCards |> List.filter (fun c -> c.guessed2 = true) 
            let guessed3 =  selectedCards |> List.map (fun c -> {c with guessed3 = true; shuffle = false})
            let nonselected = newCards |> List.filter (fun c -> c.guessed1 = false && c.guessed2 = false  && c.guessed3 = false && c.selected = false)
            let goodguess3 = guessed1 @ guessed2 @ guessed3 @ nonselected
            let cmdDeselect () = MakeGroup 
            Guessed3Group {gameState with cardsToGuess = goodguess3}, Cmd.OfAsync.perform wait1sec () cmdDeselect
          else 
            let cmdShake () = DeselectAndShake
            let checkGuesses = selectedCards |> List.filter (fun c -> c.group = hgroup)
            let shakenCards = shakeCard newCards 
            if checkGuesses.Length < 3 then 
              Guessed2 {gameState with cardsToGuess = shakenCards; attemptsLeft = gameState.attemptsLeft - 1}, Cmd.OfAsync.perform wait2sec () cmdShake
            else 
              Guessed2 {gameState with cardsToGuess = shakenCards; attemptsLeft =gameState.attemptsLeft - 1 ; showOneAway = true}, Cmd.OfAsync.perform wait2sec () cmdShake

      | Shuffle ->
        let shuffledCards = shuffleCards gameState.cardsToGuess 
        Guessed2{gameState with cardsToGuess= shuffledCards}, Cmd.none  

      | DeselectAll ->
        let newCards = gameState.cardsToGuess |> deselectCards 
        Guessed2{gameState with cardsToGuess = newCards}, Cmd.none

      | DeselectAndShake->
        let newCards = gameState.cardsToGuess |> deselectCards |> unshakeCard 
        Guessed2 {gameState with cardsToGuess = newCards ; showOneAway = false}, Cmd.none

      | _ -> state, Cmd.none
  
  | Guessed3Group gameState ->
    match msg with
    | MakeGroup ->
      let cmdDeselect () = DeselectAll
      Guessed3Group gameState, Cmd.OfAsync.perform wait1sec () cmdDeselect
    | _ ->
      let first = gameState.cardsToGuess |> List.filter (fun c -> c.guessed1)
      let second = gameState.cardsToGuess |> List.filter (fun c -> c.guessed2)
      let head = gameState.cardsToGuess |> List.filter (fun c -> c.guessed3) |> List.head
      let notguessed = gameState.cardsToGuess |> List.filter (fun c -> c.guessed1=false && c.guessed2=false && c.guessed3=false)
      let group = gameState.cardsToGuess |> List.filter (fun c ->c.group = head.group)
      let firstCard = 
        group 
        |> List.mapi (fun i c ->
          if i =0 then {c with dontShow = false; makeGroup = true} else {c with dontShow = true; makeGroup = true })
      let cmdDeselect () = DeselectAll
      Guessed3 {gameState with cardsToGuess = first @ second @ firstCard @ shuffleCards notguessed}, Cmd.OfAsync.perform wait1sec () cmdDeselect

  | Guessed3 gameState -> 
    match gameState.attemptsLeft with
    | 0 -> 
      let cmdShake () = DeselectAndShake
      GameOver {gameState with cardsToGuess = gameState.cardsToGuess ; itsOver = true ; showOneAway = false}, Cmd.OfAsync.perform wait1sec () cmdShake
    | _ -> 
      match msg with 
      | TileClick card ->
        let newCards = selectnonguessed3 card gameState.cardsToGuess
        if countSelected newCards < 4 then 
          Guessed3 {gameState with cardsToGuess = newCards}, Cmd.none
        else 
          let selectedCards = newCards |> List.filter (fun c -> c.selected)
          let hgroup = selectedCards.Head.group
          if selectedCards |> List.forall (fun c -> c.group = hgroup) then
            let guessed1 =  newCards |> List.filter (fun c -> c.guessed1 = true)
            let guessed2 =  newCards |> List.filter (fun c -> c.guessed2 = true) 
            let guessed3 =  newCards |> List.filter (fun c -> c.guessed3 = true) 
            let guessed4 =  selectedCards |> List.map (fun c -> {c with guessed4 = true; shuffle = false})
            let last = guessed4 |> List.take 1 |> List.map (fun c -> {c with makeGroup = true; dontShow = false})
            let dontshow = guessed4 |> List.skip 1 |> List.map (fun c -> {c with makeGroup = true ; dontShow = true})
            let goodguess4 = guessed1 @ guessed2 @ guessed3 @ last @ dontshow 
            let cmdDeselect () = MakeGroup 
            Guessed3 {gameState with cardsToGuess = goodguess4}, Cmd.OfAsync.perform wait1sec () cmdDeselect
          else 
            let cmdShake () = DeselectAndShake
            let checkGuesses = selectedCards |> List.filter (fun c -> c.group = hgroup)
            let shakenCards = shakeCard newCards 
            if checkGuesses.Length < 3 then 
              Guessed3 {gameState with cardsToGuess = newCards; attemptsLeft = gameState.attemptsLeft - 1}, Cmd.OfAsync.perform wait2sec () cmdShake
            else 
              Guessed3 {gameState with cardsToGuess = shakenCards; attemptsLeft =gameState.attemptsLeft - 1 ; showOneAway = true}, Cmd.OfAsync.perform wait2sec () cmdShake
      | Shuffle ->
        let shuffledCards = shuffleCards gameState.cardsToGuess 
        Guessed3{gameState with cardsToGuess= shuffledCards}, Cmd.none  

      | DeselectAll ->
        let newCards = gameState.cardsToGuess |> deselectCards 
        Guessed3{gameState with cardsToGuess = newCards}, Cmd.none

      | DeselectAndShake->
        let newCards = gameState.cardsToGuess |> deselectCards |> unshakeCard 
        Guessed3 {gameState with cardsToGuess = newCards ; showOneAway = false}, Cmd.none

  | GameOver gameState ->
    let g1 = gameState.cardsToGuess 
                        |> List.filter (fun c -> c.group = "Group1") 
                        |> List.map (fun c -> {c with guessed1 = true ; shuffle = false}) 
                        |> List.mapi (fun i c -> if i = 0 then {c with makeGroup=true ; dontShow = false} else {c with makeGroup=true ; dontShow = true})  
    let g2 = gameState.cardsToGuess 
                        |> List.filter (fun c -> c.group = "Group2") 
                        |> List.map (fun c -> {c with guessed2 = true ; shuffle = false}) 
                        |> List.mapi (fun i c -> if i = 0 then {c with makeGroup=true ; dontShow = false} else {c with makeGroup=true ; dontShow = true})  
    let g3 = gameState.cardsToGuess 
                        |> List.filter (fun c -> c.group = "Group3") 
                        |> List.map (fun c -> {c with guessed3 = true ; shuffle = false}) 
                        |> List.mapi (fun i c -> if i = 0 then {c with makeGroup=true ; dontShow = false} else {c with makeGroup=true ; dontShow = true})  
    let g4 = gameState.cardsToGuess 
                        |> List.filter (fun c -> c.group = "Group4") 
                        |> List.map (fun c -> {c with guessed3 = true ; shuffle = false}) 
                        |> List.mapi (fun i c -> if i = 0 then {c with makeGroup=true ; dontShow = false} else {c with makeGroup=true ; dontShow = true})  
    GameOver {gameState with cardsToGuess= g1 @ g2 @ g3 @ g4}, Cmd.none

  | _ -> state, Cmd.none
         

let render (state: State) (dispatch: Message -> unit) : ReactElement =
    let g1 = 
      Html.div [
        prop.className "grupa1"
        prop.children [
          Html.h2 [prop.text "It is all limited"]
          Html.br []
          Html.h3 [ prop.text "Balcony Oil Battery Tickets"]]]
    let g2 = 
      Html.div [
        prop.className "grupa2"
        prop.children [
          Html.h2 [prop.text "Symbolizes the passage of time"]
          Html.br []
          Html.h3 [ prop.text "Hourglass Sunset Candle Aging"]]]
    let g3 = 
      Html.div [
        prop.className "grupa3"
        prop.children [
          Html.h2 [prop.text "Anime"]
          Html.br []
          Html.h3 [ prop.text "Japan Spirited Away Sumuel L Jackson  Ramen"]]]
    let g4 = 
      Html.div [
        prop.className "grupa4"
        prop.children [
          Html.h2 [prop.text "Homonyms"]
          Html.br []
          Html.h3 [ prop.text "Site Cite Site Sight"]]]
    
    let card (c: Card) =
      if c.dontShow = false && c.makeGroup  then
        match c.group with
        | "Group1" -> g1
        | "Group2" -> g2
        | "Group3" -> g3
        | "Group4" -> g4
      else if c.dontShow then 
        Html.none
      else 
      let cardClasses = 
        let res= ["card"]

        let res1 = 
          if c.selected then List.append res ["selected-card"]
          else res

        if c.shake then List.append res1 ["shake-card"] else res1
      Html.div
        [ prop.classes cardClasses 
          prop.children [ Html.img [ prop.src $"/public/{c.image}"; prop.alt "Card" ] ]
          prop.onClick (fun _ -> dispatch (TileClick c))
        ]

    let cards () : ReactElement list =
        let guessingCards =
            match state with
            | Initial c -> c.cardsToGuess
            | Guessed1 c -> c.cardsToGuess
            | Guessed2 c -> c.cardsToGuess
            | Guessed3 c -> c.cardsToGuess
            | Guessed1Group c -> c.cardsToGuess
            | Guessed2Group c -> c.cardsToGuess
            | Guessed3Group c -> c.cardsToGuess
            | GameOver c -> c.cardsToGuess

            |> List.map card

        guessingCards
    let ctrlBtns () = 
      Html.div 
        [
          prop.className "ctrl-btns"
          prop.children 
            [
              Html.button 
                [
                  prop.className "shuffle-btn"
                  prop.text "Shuffle"
                  prop.onClick (fun _ -> dispatch Shuffle)
                ]
              Html.button 
                [
                  prop.className "deselect-btn"
                  prop.text "Deselect"
                  prop.onClick (fun _ -> dispatch DeselectAll)
                ]
            ]
        ]
    
    let attLeft () =
      let attempts = 
        match state with
        | Initial c -> c.attemptsLeft
        | Guessed1 c-> c.attemptsLeft
        | Guessed2 c-> c.attemptsLeft
        | Guessed3 c-> c.attemptsLeft
        | Guessed1Group c -> c.attemptsLeft
        | Guessed2Group c -> c.attemptsLeft
        | Guessed3Group c -> c.attemptsLeft
        | GameOver c -> c.attemptsLeft
      Html.div [
        prop.className "remaining-attempts"
        prop.text $"Remaining attempts: {attempts}"
      ]

    let popup (value : bool) =  
      if value then
         Html.h3 [
          prop.className "one-away"
          prop.text "You are just one card away"
         ]
      else Html.none

    let oneaway () = 
      match state with 
      | Initial gameState   -> popup gameState.showOneAway
      | Guessed1 gameState -> popup gameState.showOneAway
      | Guessed2 gameState -> popup gameState.showOneAway
      | Guessed3 gameState -> popup gameState.showOneAway
      | Guessed1Group gameState -> popup gameState.showOneAway
      | Guessed2Group gameState -> popup gameState.showOneAway
      | Guessed3Group gameState -> popup gameState.showOneAway
      | GameOver gameState -> popup gameState.showOneAway

    let showGameOver (value : bool) = 
      if value then
        Html.h2 [
          prop.className "game-over"
          prop.text "Game over! :`( See you next time"
        ]
      else Html.none

    let gameover () = 
      match state with 
      | Initial gameState   -> showGameOver gameState.itsOver
      | Guessed1 gameState -> showGameOver gameState.itsOver
      | Guessed2 gameState ->showGameOver gameState.itsOver
      | Guessed3 gameState -> showGameOver gameState.itsOver
      | Guessed1Group gameState -> showGameOver gameState.itsOver
      | Guessed2Group gameState -> showGameOver gameState.itsOver
      | Guessed3Group gameState -> showGameOver gameState.itsOver
      | GameOver gameState -> showGameOver gameState.itsOver

    
    let grid () =
        Html.div [ prop.className "grid"; cards () |> prop.children ]

    Html.div [ prop.className "container"; prop.children [ grid (); ctrlBtns (); attLeft () ; oneaway (); gameover ()] ]

Program.mkProgram init update render
|> Program.withReactSynchronous "app"
|> Program.run
