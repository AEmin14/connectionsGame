import { map, delay, cache } from "./fable_modules/fable-library-js.4.19.3/Seq.js";
import { rangeDouble } from "./fable_modules/fable-library-js.4.19.3/Range.js";
import { createObj, comparePrimitives, getEnumerator } from "./fable_modules/fable-library-js.4.19.3/Util.js";
import { MatchFailureException, Union, Record } from "./fable_modules/fable-library-js.4.19.3/Types.js";
import { union_type, list_type, record_type, bool_type, string_type, int32_type } from "./fable_modules/fable-library-js.4.19.3/Reflection.js";
import { singleton as singleton_1, skip, take, forAll, mapIndexed, head as head_3, ofArray, sortBy, append, filter, length, map as map_1 } from "./fable_modules/fable-library-js.4.19.3/List.js";
import { nonSeeded } from "./fable_modules/fable-library-js.4.19.3/Random.js";
import { singleton } from "./fable_modules/fable-library-js.4.19.3/AsyncBuilder.js";
import { sleep } from "./fable_modules/fable-library-js.4.19.3/Async.js";
import { Cmd_none } from "./fable_modules/Fable.Elmish.4.0.0/cmd.fs.js";
import { Cmd_OfAsync_start, Cmd_OfAsyncWith_perform } from "./fable_modules/Fable.Elmish.4.0.0/cmd.fs.js";
import { createElement } from "react";
import { reactApi } from "./fable_modules/Feliz.2.9.0/Interop.fs.js";
import { defaultOf } from "./fable_modules/fable-library-js.4.19.3/Util.js";
import { join } from "./fable_modules/fable-library-js.4.19.3/String.js";
import { ProgramModule_mkProgram, ProgramModule_run } from "./fable_modules/Fable.Elmish.4.0.0/program.fs.js";
import { Program_withReactSynchronous } from "./fable_modules/Fable.Elmish.React.4.0.0/react.fs.js";

export const IDSEQ = cache(delay(() => map((i) => i, rangeDouble(1, 1, 200000))));

export const nextID = (() => {
    const enum$ = getEnumerator(IDSEQ);
    const foo = () => {
        if (enum$["System.Collections.IEnumerator.MoveNext"]()) {
            return enum$["System.Collections.Generic.IEnumerator`1.get_Current"]() | 0;
        }
        else {
            throw new Error("No more ids.");
        }
    };
    return foo;
})();

export class Card extends Record {
    constructor(id, image, group, selected, shake, guessed1, guessed2, guessed3, guessed4, shuffle, makeGroup, dontShow) {
        super();
        this.id = (id | 0);
        this.image = image;
        this.group = group;
        this.selected = selected;
        this.shake = shake;
        this.guessed1 = guessed1;
        this.guessed2 = guessed2;
        this.guessed3 = guessed3;
        this.guessed4 = guessed4;
        this.shuffle = shuffle;
        this.makeGroup = makeGroup;
        this.dontShow = dontShow;
    }
}

export function Card_$reflection() {
    return record_type("Program.Card", [], Card, () => [["id", int32_type], ["image", string_type], ["group", string_type], ["selected", bool_type], ["shake", bool_type], ["guessed1", bool_type], ["guessed2", bool_type], ["guessed3", bool_type], ["guessed4", bool_type], ["shuffle", bool_type], ["makeGroup", bool_type], ["dontShow", bool_type]]);
}

export function Card_makeCard_Z384F8060(image, group) {
    return new Card(nextID(), image, group, false, false, false, false, false, false, true, false, false);
}

export class Game extends Record {
    constructor(cardsToGuess, attemptsLeft, showOneAway, itsOver) {
        super();
        this.cardsToGuess = cardsToGuess;
        this.attemptsLeft = (attemptsLeft | 0);
        this.showOneAway = showOneAway;
        this.itsOver = itsOver;
    }
}

export function Game_$reflection() {
    return record_type("Program.Game", [], Game, () => [["cardsToGuess", list_type(Card_$reflection())], ["attemptsLeft", int32_type], ["showOneAway", bool_type], ["itsOver", bool_type]]);
}

export class State extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Initial", "Guessed1", "Guessed2", "Guessed3", "GameOver", "Guessed1Group", "Guessed2Group", "Guessed3Group"];
    }
}

export function State_$reflection() {
    return union_type("Program.State", [], State, () => [[["Item", Game_$reflection()]], [["Item", Game_$reflection()]], [["Item", Game_$reflection()]], [["Item", Game_$reflection()]], [["Item", Game_$reflection()]], [["Item", Game_$reflection()]], [["Item", Game_$reflection()]], [["Item", Game_$reflection()]]]);
}

export class Message extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["TileClick", "DeselectAll", "DeselectAndShake", "Shuffle", "MakeGroup"];
    }
}

export function Message_$reflection() {
    return union_type("Program.Message", [], Message, () => [[["Item", Card_$reflection()]], [], [], [], []]);
}

export function selectCard(card, cards_1) {
    return map_1((c) => {
        if (c.id === card.id) {
            return new Card(c.id, c.image, c.group, true, c.shake, c.guessed1, c.guessed2, c.guessed3, c.guessed4, c.shuffle, c.makeGroup, c.dontShow);
        }
        else {
            return c;
        }
    }, cards_1);
}

export function selectnonguessed1(card, cards_1) {
    return map_1((c) => {
        if ((c.id === card.id) && (card.guessed1 !== true)) {
            return new Card(c.id, c.image, c.group, true, c.shake, c.guessed1, c.guessed2, c.guessed3, c.guessed4, c.shuffle, c.makeGroup, c.dontShow);
        }
        else {
            return c;
        }
    }, cards_1);
}

export function selectnonguessed2(card, cards_1) {
    return map_1((c) => {
        if (((c.id === card.id) && (card.guessed1 !== true)) && (card.guessed2 !== true)) {
            return new Card(c.id, c.image, c.group, true, c.shake, c.guessed1, c.guessed2, c.guessed3, c.guessed4, c.shuffle, c.makeGroup, c.dontShow);
        }
        else {
            return c;
        }
    }, cards_1);
}

export function selectnonguessed3(card, cards_1) {
    return map_1((c) => {
        if ((((c.id === card.id) && (card.guessed1 !== true)) && (card.guessed2 !== true)) && (card.guessed3 !== true)) {
            return new Card(c.id, c.image, c.group, true, c.shake, c.guessed1, c.guessed2, c.guessed3, c.guessed4, c.shuffle, c.makeGroup, c.dontShow);
        }
        else {
            return c;
        }
    }, cards_1);
}

export function deselectCards(cards_1) {
    return map_1((c) => (new Card(c.id, c.image, c.group, false, c.shake, c.guessed1, c.guessed2, c.guessed3, c.guessed4, c.shuffle, c.makeGroup, c.dontShow)), cards_1);
}

export function shakeCard(cards_1) {
    const foo = (c) => {
        if (c.selected) {
            return new Card(c.id, c.image, c.group, c.selected, true, c.guessed1, c.guessed2, c.guessed3, c.guessed4, c.shuffle, c.makeGroup, c.dontShow);
        }
        else {
            return c;
        }
    };
    return map_1(foo, cards_1);
}

export function unshakeCard(cards_1) {
    return map_1((c) => (new Card(c.id, c.image, c.group, c.selected, false, c.guessed1, c.guessed2, c.guessed3, c.guessed4, c.shuffle, c.makeGroup, c.dontShow)), cards_1);
}

export function countSelected(cards_1) {
    return length(filter((c) => c.selected, cards_1));
}

export function shuffleCards(cards_1) {
    const rnd = nonSeeded();
    const toshuffle = filter((c) => (c.shuffle === true), cards_1);
    const g1_1 = filter((c_1) => c_1.guessed1, cards_1);
    const g2_1 = filter((c_2) => c_2.guessed2, cards_1);
    const g3_1 = filter((c_3) => c_3.guessed3, cards_1);
    const l1 = append(g1_1, append(g2_1, g3_1));
    return append(l1, sortBy((_arg) => rnd.Next0(), toshuffle, {
        Compare: comparePrimitives,
    }));
}

export function wait4sec() {
    return singleton.Delay(() => singleton.Bind(sleep(4000), () => singleton.Return(undefined)));
}

export function wait2sec() {
    return singleton.Delay(() => singleton.Bind(sleep(2000), () => singleton.Return(undefined)));
}

export function wait1sec() {
    return singleton.Delay(() => singleton.Bind(sleep(1500), () => singleton.Return(undefined)));
}

export const g1 = ofArray(["balkon.png", "oil.png", "bat.png", "ticket.png"]);

export const g2 = ofArray(["candle.png", "clock.png", "sunset.png", "old.png"]);

export const g3 = ofArray(["flag.png", "chihiro.png", "sam.png", "ramen.png"]);

export const g4 = ofArray(["cite.png", "loc.png", "sight.png", "site.png"]);

export const cards = append(map_1((img) => Card_makeCard_Z384F8060(img, "Group1"), g1), append(map_1((img_1) => Card_makeCard_Z384F8060(img_1, "Group2"), g2), append(map_1((img_2) => Card_makeCard_Z384F8060(img_2, "Group3"), g3), map_1((img_3) => Card_makeCard_Z384F8060(img_3, "Group4"), g4))));

export function init() {
    return [new State(0, [new Game(shuffleCards(shuffleCards(cards)), 4, false, false)]), Cmd_none()];
}

export function update(msg, state) {
    switch (state.tag) {
        case 5: {
            const gameState_1 = state.fields[0];
            if (msg.tag === 4) {
                const cmdDeselect_1 = () => (new Message(1, []));
                return [new State(5, [gameState_1]), Cmd_OfAsyncWith_perform((x_4) => {
                    Cmd_OfAsync_start(x_4);
                }, wait1sec, undefined, cmdDeselect_1)];
            }
            else {
                const head = head_3(filter((c_5) => c_5.guessed1, gameState_1.cardsToGuess));
                const notguessed = filter((c_6) => (c_6.guessed1 === false), gameState_1.cardsToGuess);
                const group = filter((c_7) => (c_7.group === head.group), gameState_1.cardsToGuess);
                const firstCard = mapIndexed((i, c_8) => {
                    if (i === 0) {
                        return new Card(c_8.id, c_8.image, c_8.group, c_8.selected, c_8.shake, c_8.guessed1, c_8.guessed2, c_8.guessed3, c_8.guessed4, c_8.shuffle, true, false);
                    }
                    else {
                        return new Card(c_8.id, c_8.image, c_8.group, c_8.selected, c_8.shake, c_8.guessed1, c_8.guessed2, c_8.guessed3, c_8.guessed4, c_8.shuffle, true, true);
                    }
                }, group);
                const cmdDeselect_2 = () => (new Message(1, []));
                return [new State(1, [new Game(append(firstCard, shuffleCards(notguessed)), gameState_1.attemptsLeft, gameState_1.showOneAway, gameState_1.itsOver)]), Cmd_OfAsyncWith_perform((x_5) => {
                    Cmd_OfAsync_start(x_5);
                }, wait1sec, undefined, cmdDeselect_2)];
            }
        }
        case 1: {
            const gameState_2 = state.fields[0];
            if (gameState_2.attemptsLeft === 0) {
                const cmdShake_2 = () => (new Message(2, []));
                return [new State(4, [new Game(gameState_2.cardsToGuess, gameState_2.attemptsLeft, false, true)]), Cmd_OfAsyncWith_perform((x_6) => {
                    Cmd_OfAsync_start(x_6);
                }, wait1sec, undefined, cmdShake_2)];
            }
            else {
                switch (msg.tag) {
                    case 0: {
                        const card_1 = msg.fields[0];
                        const newCards_3 = selectnonguessed1(card_1, gameState_2.cardsToGuess);
                        if (countSelected(newCards_3) < 4) {
                            return [new State(1, [new Game(newCards_3, gameState_2.attemptsLeft, gameState_2.showOneAway, gameState_2.itsOver)]), Cmd_none()];
                        }
                        else {
                            const selectedCards_1 = filter((c_9) => c_9.selected, newCards_3);
                            const hgroup_1 = head_3(selectedCards_1).group;
                            if (forAll((c_10) => (c_10.group === hgroup_1), selectedCards_1)) {
                                const guessed1 = filter((c_11) => (c_11.guessed1 === true), newCards_3);
                                const guessed2 = map_1((c_12) => (new Card(c_12.id, c_12.image, c_12.group, c_12.selected, c_12.shake, c_12.guessed1, true, c_12.guessed3, c_12.guessed4, false, c_12.makeGroup, c_12.dontShow)), selectedCards_1);
                                const nonselected_1 = filter((c_13) => {
                                    if ((c_13.guessed1 === false) && (c_13.guessed2 === false)) {
                                        return c_13.selected === false;
                                    }
                                    else {
                                        return false;
                                    }
                                }, newCards_3);
                                const g1_1 = append(guessed1, guessed2);
                                const goodGuess2 = append(g1_1, nonselected_1);
                                const cmdDeselect_3 = () => (new Message(4, []));
                                return [new State(6, [new Game(goodGuess2, gameState_2.attemptsLeft, gameState_2.showOneAway, gameState_2.itsOver)]), Cmd_OfAsyncWith_perform((x_7) => {
                                    Cmd_OfAsync_start(x_7);
                                }, wait1sec, undefined, cmdDeselect_3)];
                            }
                            else {
                                const cmdShake_3 = () => (new Message(2, []));
                                const checkGuesses_1 = filter((c_14) => (c_14.group === hgroup_1), selectedCards_1);
                                const shakenCards_1 = shakeCard(newCards_3);
                                if (length(checkGuesses_1) < 3) {
                                    return [new State(1, [new Game(shakenCards_1, gameState_2.attemptsLeft - 1, gameState_2.showOneAway, gameState_2.itsOver)]), Cmd_OfAsyncWith_perform((x_8) => {
                                        Cmd_OfAsync_start(x_8);
                                    }, wait2sec, undefined, cmdShake_3)];
                                }
                                else {
                                    return [new State(1, [new Game(shakenCards_1, gameState_2.attemptsLeft - 1, true, gameState_2.itsOver)]), Cmd_OfAsyncWith_perform((x_9) => {
                                        Cmd_OfAsync_start(x_9);
                                    }, wait2sec, undefined, cmdShake_3)];
                                }
                            }
                        }
                    }
                    case 3: {
                        const shuffledCards_1 = shuffleCards(gameState_2.cardsToGuess);
                        return [new State(1, [new Game(shuffledCards_1, gameState_2.attemptsLeft, gameState_2.showOneAway, gameState_2.itsOver)]), Cmd_none()];
                    }
                    case 1: {
                        const newCards_4 = deselectCards(gameState_2.cardsToGuess);
                        return [new State(1, [new Game(newCards_4, gameState_2.attemptsLeft, gameState_2.showOneAway, gameState_2.itsOver)]), Cmd_none()];
                    }
                    case 2: {
                        const newCards_5 = unshakeCard(deselectCards(gameState_2.cardsToGuess));
                        return [new State(1, [new Game(newCards_5, gameState_2.attemptsLeft, false, gameState_2.itsOver)]), Cmd_none()];
                    }
                    default:
                        return [state, Cmd_none()];
                }
            }
        }
        case 6: {
            const gameState_3 = state.fields[0];
            if (msg.tag === 4) {
                const cmdDeselect_4 = () => (new Message(1, []));
                return [new State(6, [gameState_3]), Cmd_OfAsyncWith_perform((x_10) => {
                    Cmd_OfAsync_start(x_10);
                }, wait1sec, undefined, cmdDeselect_4)];
            }
            else {
                const first = filter((c_15) => c_15.guessed1, gameState_3.cardsToGuess);
                const head_1 = head_3(filter((c_16) => c_16.guessed2, gameState_3.cardsToGuess));
                const notguessed_1 = filter((c_17) => {
                    if (c_17.guessed1 === false) {
                        return c_17.guessed2 === false;
                    }
                    else {
                        return false;
                    }
                }, gameState_3.cardsToGuess);
                const group_1 = filter((c_18) => (c_18.group === head_1.group), gameState_3.cardsToGuess);
                const firstCard_1 = mapIndexed((i_1, c_19) => {
                    if (i_1 === 0) {
                        return new Card(c_19.id, c_19.image, c_19.group, c_19.selected, c_19.shake, c_19.guessed1, c_19.guessed2, c_19.guessed3, c_19.guessed4, c_19.shuffle, true, false);
                    }
                    else {
                        return new Card(c_19.id, c_19.image, c_19.group, c_19.selected, c_19.shake, c_19.guessed1, c_19.guessed2, c_19.guessed3, c_19.guessed4, c_19.shuffle, true, true);
                    }
                }, group_1);
                const cmdDeselect_5 = () => (new Message(1, []));
                return [new State(2, [new Game(append(first, append(firstCard_1, shuffleCards(notguessed_1))), gameState_3.attemptsLeft, gameState_3.showOneAway, gameState_3.itsOver)]), Cmd_OfAsyncWith_perform((x_11) => {
                    Cmd_OfAsync_start(x_11);
                }, wait1sec, undefined, cmdDeselect_5)];
            }
        }
        case 2: {
            const gameState_4 = state.fields[0];
            if (gameState_4.attemptsLeft === 0) {
                const cmdShake_4 = () => (new Message(2, []));
                return [new State(4, [new Game(gameState_4.cardsToGuess, gameState_4.attemptsLeft, false, true)]), Cmd_OfAsyncWith_perform((x_12) => {
                    Cmd_OfAsync_start(x_12);
                }, wait1sec, undefined, cmdShake_4)];
            }
            else {
                switch (msg.tag) {
                    case 0: {
                        const card_2 = msg.fields[0];
                        const newCards_6 = selectnonguessed2(card_2, gameState_4.cardsToGuess);
                        if (countSelected(newCards_6) < 4) {
                            return [new State(2, [new Game(newCards_6, gameState_4.attemptsLeft, gameState_4.showOneAway, gameState_4.itsOver)]), Cmd_none()];
                        }
                        else {
                            const selectedCards_2 = filter((c_20) => c_20.selected, newCards_6);
                            const hgroup_2 = head_3(selectedCards_2).group;
                            if (forAll((c_21) => (c_21.group === hgroup_2), selectedCards_2)) {
                                const guessed1_1 = filter((c_22) => (c_22.guessed1 === true), newCards_6);
                                const guessed2_1 = filter((c_23) => (c_23.guessed2 === true), newCards_6);
                                const guessed3 = map_1((c_24) => (new Card(c_24.id, c_24.image, c_24.group, c_24.selected, c_24.shake, c_24.guessed1, c_24.guessed2, true, c_24.guessed4, false, c_24.makeGroup, c_24.dontShow)), selectedCards_2);
                                const nonselected_2 = filter((c_25) => {
                                    if (((c_25.guessed1 === false) && (c_25.guessed2 === false)) && (c_25.guessed3 === false)) {
                                        return c_25.selected === false;
                                    }
                                    else {
                                        return false;
                                    }
                                }, newCards_6);
                                const goodguess3 = append(guessed1_1, append(guessed2_1, append(guessed3, nonselected_2)));
                                const cmdDeselect_6 = () => (new Message(4, []));
                                return [new State(7, [new Game(goodguess3, gameState_4.attemptsLeft, gameState_4.showOneAway, gameState_4.itsOver)]), Cmd_OfAsyncWith_perform((x_13) => {
                                    Cmd_OfAsync_start(x_13);
                                }, wait1sec, undefined, cmdDeselect_6)];
                            }
                            else {
                                const cmdShake_5 = () => (new Message(2, []));
                                const checkGuesses_2 = filter((c_26) => (c_26.group === hgroup_2), selectedCards_2);
                                const shakenCards_2 = shakeCard(newCards_6);
                                if (length(checkGuesses_2) < 3) {
                                    return [new State(2, [new Game(shakenCards_2, gameState_4.attemptsLeft - 1, gameState_4.showOneAway, gameState_4.itsOver)]), Cmd_OfAsyncWith_perform((x_14) => {
                                        Cmd_OfAsync_start(x_14);
                                    }, wait2sec, undefined, cmdShake_5)];
                                }
                                else {
                                    return [new State(2, [new Game(shakenCards_2, gameState_4.attemptsLeft - 1, true, gameState_4.itsOver)]), Cmd_OfAsyncWith_perform((x_15) => {
                                        Cmd_OfAsync_start(x_15);
                                    }, wait2sec, undefined, cmdShake_5)];
                                }
                            }
                        }
                    }
                    case 3: {
                        const shuffledCards_2 = shuffleCards(gameState_4.cardsToGuess);
                        return [new State(2, [new Game(shuffledCards_2, gameState_4.attemptsLeft, gameState_4.showOneAway, gameState_4.itsOver)]), Cmd_none()];
                    }
                    case 1: {
                        const newCards_7 = deselectCards(gameState_4.cardsToGuess);
                        return [new State(2, [new Game(newCards_7, gameState_4.attemptsLeft, gameState_4.showOneAway, gameState_4.itsOver)]), Cmd_none()];
                    }
                    case 2: {
                        const newCards_8 = unshakeCard(deselectCards(gameState_4.cardsToGuess));
                        return [new State(2, [new Game(newCards_8, gameState_4.attemptsLeft, false, gameState_4.itsOver)]), Cmd_none()];
                    }
                    default:
                        return [state, Cmd_none()];
                }
            }
        }
        case 7: {
            const gameState_5 = state.fields[0];
            if (msg.tag === 4) {
                const cmdDeselect_7 = () => (new Message(1, []));
                return [new State(7, [gameState_5]), Cmd_OfAsyncWith_perform((x_16) => {
                    Cmd_OfAsync_start(x_16);
                }, wait1sec, undefined, cmdDeselect_7)];
            }
            else {
                const first_1 = filter((c_27) => c_27.guessed1, gameState_5.cardsToGuess);
                const second = filter((c_28) => c_28.guessed2, gameState_5.cardsToGuess);
                const head_2 = head_3(filter((c_29) => c_29.guessed3, gameState_5.cardsToGuess));
                const notguessed_2 = filter((c_30) => {
                    if ((c_30.guessed1 === false) && (c_30.guessed2 === false)) {
                        return c_30.guessed3 === false;
                    }
                    else {
                        return false;
                    }
                }, gameState_5.cardsToGuess);
                const group_2 = filter((c_31) => (c_31.group === head_2.group), gameState_5.cardsToGuess);
                const firstCard_2 = mapIndexed((i_2, c_32) => {
                    if (i_2 === 0) {
                        return new Card(c_32.id, c_32.image, c_32.group, c_32.selected, c_32.shake, c_32.guessed1, c_32.guessed2, c_32.guessed3, c_32.guessed4, c_32.shuffle, true, false);
                    }
                    else {
                        return new Card(c_32.id, c_32.image, c_32.group, c_32.selected, c_32.shake, c_32.guessed1, c_32.guessed2, c_32.guessed3, c_32.guessed4, c_32.shuffle, true, true);
                    }
                }, group_2);
                const cmdDeselect_8 = () => (new Message(1, []));
                return [new State(3, [new Game(append(first_1, append(second, append(firstCard_2, shuffleCards(notguessed_2)))), gameState_5.attemptsLeft, gameState_5.showOneAway, gameState_5.itsOver)]), Cmd_OfAsyncWith_perform((x_17) => {
                    Cmd_OfAsync_start(x_17);
                }, wait1sec, undefined, cmdDeselect_8)];
            }
        }
        case 3: {
            const gameState_6 = state.fields[0];
            if (gameState_6.attemptsLeft === 0) {
                const cmdShake_6 = () => (new Message(2, []));
                return [new State(4, [new Game(gameState_6.cardsToGuess, gameState_6.attemptsLeft, false, true)]), Cmd_OfAsyncWith_perform((x_18) => {
                    Cmd_OfAsync_start(x_18);
                }, wait1sec, undefined, cmdShake_6)];
            }
            else {
                switch (msg.tag) {
                    case 0: {
                        const card_3 = msg.fields[0];
                        const newCards_9 = selectnonguessed3(card_3, gameState_6.cardsToGuess);
                        if (countSelected(newCards_9) < 4) {
                            return [new State(3, [new Game(newCards_9, gameState_6.attemptsLeft, gameState_6.showOneAway, gameState_6.itsOver)]), Cmd_none()];
                        }
                        else {
                            const selectedCards_3 = filter((c_33) => c_33.selected, newCards_9);
                            const hgroup_3 = head_3(selectedCards_3).group;
                            if (forAll((c_34) => (c_34.group === hgroup_3), selectedCards_3)) {
                                const guessed1_2 = filter((c_35) => (c_35.guessed1 === true), newCards_9);
                                const guessed2_2 = filter((c_36) => (c_36.guessed2 === true), newCards_9);
                                const guessed3_1 = filter((c_37) => (c_37.guessed3 === true), newCards_9);
                                const guessed4 = map_1((c_38) => (new Card(c_38.id, c_38.image, c_38.group, c_38.selected, c_38.shake, c_38.guessed1, c_38.guessed2, c_38.guessed3, true, false, c_38.makeGroup, c_38.dontShow)), selectedCards_3);
                                const last = map_1((c_39) => (new Card(c_39.id, c_39.image, c_39.group, c_39.selected, c_39.shake, c_39.guessed1, c_39.guessed2, c_39.guessed3, c_39.guessed4, c_39.shuffle, true, false)), take(1, guessed4));
                                const dontshow = map_1((c_40) => (new Card(c_40.id, c_40.image, c_40.group, c_40.selected, c_40.shake, c_40.guessed1, c_40.guessed2, c_40.guessed3, c_40.guessed4, c_40.shuffle, true, true)), skip(1, guessed4));
                                const goodguess4 = append(guessed1_2, append(guessed2_2, append(guessed3_1, append(last, dontshow))));
                                const cmdDeselect_9 = () => (new Message(4, []));
                                return [new State(3, [new Game(goodguess4, gameState_6.attemptsLeft, gameState_6.showOneAway, gameState_6.itsOver)]), Cmd_OfAsyncWith_perform((x_19) => {
                                    Cmd_OfAsync_start(x_19);
                                }, wait1sec, undefined, cmdDeselect_9)];
                            }
                            else {
                                const cmdShake_7 = () => (new Message(2, []));
                                const checkGuesses_3 = filter((c_41) => (c_41.group === hgroup_3), selectedCards_3);
                                const shakenCards_3 = shakeCard(newCards_9);
                                if (length(checkGuesses_3) < 3) {
                                    return [new State(3, [new Game(newCards_9, gameState_6.attemptsLeft - 1, gameState_6.showOneAway, gameState_6.itsOver)]), Cmd_OfAsyncWith_perform((x_20) => {
                                        Cmd_OfAsync_start(x_20);
                                    }, wait2sec, undefined, cmdShake_7)];
                                }
                                else {
                                    return [new State(3, [new Game(shakenCards_3, gameState_6.attemptsLeft - 1, true, gameState_6.itsOver)]), Cmd_OfAsyncWith_perform((x_21) => {
                                        Cmd_OfAsync_start(x_21);
                                    }, wait2sec, undefined, cmdShake_7)];
                                }
                            }
                        }
                    }
                    case 3: {
                        const shuffledCards_3 = shuffleCards(gameState_6.cardsToGuess);
                        return [new State(3, [new Game(shuffledCards_3, gameState_6.attemptsLeft, gameState_6.showOneAway, gameState_6.itsOver)]), Cmd_none()];
                    }
                    case 1: {
                        const newCards_10 = deselectCards(gameState_6.cardsToGuess);
                        return [new State(3, [new Game(newCards_10, gameState_6.attemptsLeft, gameState_6.showOneAway, gameState_6.itsOver)]), Cmd_none()];
                    }
                    case 2: {
                        const newCards_11 = unshakeCard(deselectCards(gameState_6.cardsToGuess));
                        return [new State(3, [new Game(newCards_11, gameState_6.attemptsLeft, false, gameState_6.itsOver)]), Cmd_none()];
                    }
                    default:
                        throw new Error("Match failure: Program.Message");
                }
            }
        }
        case 4: {
            const gameState_7 = state.fields[0];
            const g1_2 = mapIndexed((i_3, c_44) => {
                if (i_3 === 0) {
                    return new Card(c_44.id, c_44.image, c_44.group, c_44.selected, c_44.shake, c_44.guessed1, c_44.guessed2, c_44.guessed3, c_44.guessed4, c_44.shuffle, true, false);
                }
                else {
                    return new Card(c_44.id, c_44.image, c_44.group, c_44.selected, c_44.shake, c_44.guessed1, c_44.guessed2, c_44.guessed3, c_44.guessed4, c_44.shuffle, true, true);
                }
            }, map_1((c_43) => (new Card(c_43.id, c_43.image, c_43.group, c_43.selected, c_43.shake, true, c_43.guessed2, c_43.guessed3, c_43.guessed4, false, c_43.makeGroup, c_43.dontShow)), filter((c_42) => (c_42.group === "Group1"), gameState_7.cardsToGuess)));
            const g2_1 = mapIndexed((i_4, c_47) => {
                if (i_4 === 0) {
                    return new Card(c_47.id, c_47.image, c_47.group, c_47.selected, c_47.shake, c_47.guessed1, c_47.guessed2, c_47.guessed3, c_47.guessed4, c_47.shuffle, true, false);
                }
                else {
                    return new Card(c_47.id, c_47.image, c_47.group, c_47.selected, c_47.shake, c_47.guessed1, c_47.guessed2, c_47.guessed3, c_47.guessed4, c_47.shuffle, true, true);
                }
            }, map_1((c_46) => (new Card(c_46.id, c_46.image, c_46.group, c_46.selected, c_46.shake, c_46.guessed1, true, c_46.guessed3, c_46.guessed4, false, c_46.makeGroup, c_46.dontShow)), filter((c_45) => (c_45.group === "Group2"), gameState_7.cardsToGuess)));
            const g3_1 = mapIndexed((i_5, c_50) => {
                if (i_5 === 0) {
                    return new Card(c_50.id, c_50.image, c_50.group, c_50.selected, c_50.shake, c_50.guessed1, c_50.guessed2, c_50.guessed3, c_50.guessed4, c_50.shuffle, true, false);
                }
                else {
                    return new Card(c_50.id, c_50.image, c_50.group, c_50.selected, c_50.shake, c_50.guessed1, c_50.guessed2, c_50.guessed3, c_50.guessed4, c_50.shuffle, true, true);
                }
            }, map_1((c_49) => (new Card(c_49.id, c_49.image, c_49.group, c_49.selected, c_49.shake, c_49.guessed1, c_49.guessed2, true, c_49.guessed4, false, c_49.makeGroup, c_49.dontShow)), filter((c_48) => (c_48.group === "Group3"), gameState_7.cardsToGuess)));
            const g4_1 = mapIndexed((i_6, c_53) => {
                if (i_6 === 0) {
                    return new Card(c_53.id, c_53.image, c_53.group, c_53.selected, c_53.shake, c_53.guessed1, c_53.guessed2, c_53.guessed3, c_53.guessed4, c_53.shuffle, true, false);
                }
                else {
                    return new Card(c_53.id, c_53.image, c_53.group, c_53.selected, c_53.shake, c_53.guessed1, c_53.guessed2, c_53.guessed3, c_53.guessed4, c_53.shuffle, true, true);
                }
            }, map_1((c_52) => (new Card(c_52.id, c_52.image, c_52.group, c_52.selected, c_52.shake, c_52.guessed1, c_52.guessed2, true, c_52.guessed4, false, c_52.makeGroup, c_52.dontShow)), filter((c_51) => (c_51.group === "Group4"), gameState_7.cardsToGuess)));
            return [new State(4, [new Game(append(g1_2, append(g2_1, append(g3_1, g4_1))), gameState_7.attemptsLeft, gameState_7.showOneAway, gameState_7.itsOver)]), Cmd_none()];
        }
        default: {
            const gameState = state.fields[0];
            if (gameState.attemptsLeft === 0) {
                const cmdShake = () => (new Message(2, []));
                return [new State(4, [new Game(gameState.cardsToGuess, gameState.attemptsLeft, false, true)]), Cmd_OfAsyncWith_perform((x) => {
                    Cmd_OfAsync_start(x);
                }, wait1sec, undefined, cmdShake)];
            }
            else {
                switch (msg.tag) {
                    case 0: {
                        const card = msg.fields[0];
                        const newCards = selectCard(card, gameState.cardsToGuess);
                        if (countSelected(newCards) < 4) {
                            return [new State(0, [new Game(newCards, gameState.attemptsLeft, gameState.showOneAway, gameState.itsOver)]), Cmd_none()];
                        }
                        else {
                            const selectedCards = filter((c) => c.selected, newCards);
                            const hgroup = head_3(selectedCards).group;
                            if (forAll((c_1) => (c_1.group === hgroup), selectedCards)) {
                                const guessed_1 = map_1((c_2) => (new Card(c_2.id, c_2.image, c_2.group, c_2.selected, c_2.shake, true, c_2.guessed2, c_2.guessed3, c_2.guessed4, false, c_2.makeGroup, c_2.dontShow)), selectedCards);
                                const nonselected = filter((c_3) => (c_3.selected === false), newCards);
                                const goodGuess1 = append(guessed_1, nonselected);
                                const cmdDeselect = () => (new Message(4, []));
                                return [new State(5, [new Game(goodGuess1, gameState.attemptsLeft, gameState.showOneAway, gameState.itsOver)]), Cmd_OfAsyncWith_perform((x_1) => {
                                    Cmd_OfAsync_start(x_1);
                                }, wait1sec, undefined, cmdDeselect)];
                            }
                            else {
                                const cmdShake_1 = () => (new Message(2, []));
                                const checkGuesses = filter((c_4) => (c_4.group === hgroup), selectedCards);
                                const shakenCards = shakeCard(newCards);
                                if (length(checkGuesses) < 3) {
                                    return [new State(0, [new Game(shakenCards, gameState.attemptsLeft - 1, gameState.showOneAway, gameState.itsOver)]), Cmd_OfAsyncWith_perform((x_2) => {
                                        Cmd_OfAsync_start(x_2);
                                    }, wait2sec, undefined, cmdShake_1)];
                                }
                                else {
                                    return [new State(0, [new Game(shakenCards, gameState.attemptsLeft - 1, true, gameState.itsOver)]), Cmd_OfAsyncWith_perform((x_3) => {
                                        Cmd_OfAsync_start(x_3);
                                    }, wait2sec, undefined, cmdShake_1)];
                                }
                            }
                        }
                    }
                    case 3: {
                        const shuffledCards = shuffleCards(gameState.cardsToGuess);
                        return [new State(0, [new Game(shuffledCards, gameState.attemptsLeft, gameState.showOneAway, gameState.itsOver)]), Cmd_none()];
                    }
                    case 1: {
                        const newCards_1 = deselectCards(gameState.cardsToGuess);
                        return [new State(0, [new Game(newCards_1, gameState.attemptsLeft, gameState.showOneAway, gameState.itsOver)]), Cmd_none()];
                    }
                    case 2: {
                        const newCards_2 = deselectCards(unshakeCard(gameState.cardsToGuess));
                        return [new State(0, [new Game(newCards_2, gameState.attemptsLeft, false, gameState.itsOver)]), Cmd_none()];
                    }
                    default:
                        return [state, Cmd_none()];
                }
            }
        }
    }
}

export function render(state, dispatch) {
    let elems, elems_1, elems_2, elems_3, elems_8;
    const g1_1 = createElement("div", createObj(ofArray([["className", "grupa1"], (elems = [createElement("h2", {
        children: "It is all limited",
    }), createElement("br", {}), createElement("h3", {
        children: "Balcony Oil Battery Tickets",
    })], ["children", reactApi.Children.toArray(Array.from(elems))])])));
    const g2_1 = createElement("div", createObj(ofArray([["className", "grupa2"], (elems_1 = [createElement("h2", {
        children: "Symbolizes the passage of time",
    }), createElement("br", {}), createElement("h3", {
        children: "Hourglass Sunset Candle Aging",
    })], ["children", reactApi.Children.toArray(Array.from(elems_1))])])));
    const g3_1 = createElement("div", createObj(ofArray([["className", "grupa3"], (elems_2 = [createElement("h2", {
        children: "Anime",
    }), createElement("br", {}), createElement("h3", {
        children: "Japan Spirited Away Sumuel L Jackson  Ramen",
    })], ["children", reactApi.Children.toArray(Array.from(elems_2))])])));
    const g4_1 = createElement("div", createObj(ofArray([["className", "grupa4"], (elems_3 = [createElement("h2", {
        children: "Homonyms",
    }), createElement("br", {}), createElement("h3", {
        children: "Site Cite Site Sight",
    })], ["children", reactApi.Children.toArray(Array.from(elems_3))])])));
    const card = (c) => {
        let elems_4;
        if ((c.dontShow === false) && c.makeGroup) {
            const matchValue = c.group;
            switch (matchValue) {
                case "Group1":
                    return g1_1;
                case "Group2":
                    return g2_1;
                case "Group3":
                    return g3_1;
                case "Group4":
                    return g4_1;
                default:
                    throw new MatchFailureException("/home/emin/Documents/fp/emin_alikadic_20118/app/Program.fs", 428, 14);
            }
        }
        else if (c.dontShow) {
            return defaultOf();
        }
        else {
            let cardClasses;
            const res = singleton_1("card");
            const res1 = c.selected ? append(res, singleton_1("selected-card")) : res;
            cardClasses = (c.shake ? append(res1, singleton_1("shake-card")) : res1);
            return createElement("div", createObj(ofArray([["className", join(" ", cardClasses)], (elems_4 = [createElement("img", {
                src: `/public/${c.image}`,
                alt: "Card",
            })], ["children", reactApi.Children.toArray(Array.from(elems_4))]), ["onClick", (_arg) => {
                dispatch(new Message(0, [c]));
            }]])));
        }
    };
    const cards_1 = () => {
        let c_2, c_3, c_4, c_5, c_6, c_7, c_8, c_1;
        const guessingCards = map_1(card, (state.tag === 1) ? ((c_2 = state.fields[0], c_2.cardsToGuess)) : ((state.tag === 2) ? ((c_3 = state.fields[0], c_3.cardsToGuess)) : ((state.tag === 3) ? ((c_4 = state.fields[0], c_4.cardsToGuess)) : ((state.tag === 5) ? ((c_5 = state.fields[0], c_5.cardsToGuess)) : ((state.tag === 6) ? ((c_6 = state.fields[0], c_6.cardsToGuess)) : ((state.tag === 7) ? ((c_7 = state.fields[0], c_7.cardsToGuess)) : ((state.tag === 4) ? ((c_8 = state.fields[0], c_8.cardsToGuess)) : ((c_1 = state.fields[0], c_1.cardsToGuess)))))))));
        return guessingCards;
    };
    const ctrlBtns = () => {
        let elems_5;
        return createElement("div", createObj(ofArray([["className", "ctrl-btns"], (elems_5 = [createElement("button", {
            className: "shuffle-btn",
            children: "Shuffle",
            onClick: (_arg_1) => {
                dispatch(new Message(3, []));
            },
        }), createElement("button", {
            className: "deselect-btn",
            children: "Deselect",
            onClick: (_arg_2) => {
                dispatch(new Message(1, []));
            },
        })], ["children", reactApi.Children.toArray(Array.from(elems_5))])])));
    };
    const attLeft = () => {
        let attempts;
        switch (state.tag) {
            case 1: {
                const c_10 = state.fields[0];
                attempts = c_10.attemptsLeft;
                break;
            }
            case 2: {
                const c_11 = state.fields[0];
                attempts = c_11.attemptsLeft;
                break;
            }
            case 3: {
                const c_12 = state.fields[0];
                attempts = c_12.attemptsLeft;
                break;
            }
            case 5: {
                const c_13 = state.fields[0];
                attempts = c_13.attemptsLeft;
                break;
            }
            case 6: {
                const c_14 = state.fields[0];
                attempts = c_14.attemptsLeft;
                break;
            }
            case 7: {
                const c_15 = state.fields[0];
                attempts = c_15.attemptsLeft;
                break;
            }
            case 4: {
                const c_16 = state.fields[0];
                attempts = c_16.attemptsLeft;
                break;
            }
            default: {
                const c_9 = state.fields[0];
                attempts = c_9.attemptsLeft;
            }
        }
        return createElement("div", {
            className: "remaining-attempts",
            children: `Remaining attempts: ${attempts}`,
        });
    };
    const popup = (value_52) => {
        if (value_52) {
            return createElement("h3", {
                className: "one-away",
                children: "You are just one card away",
            });
        }
        else {
            return defaultOf();
        }
    };
    const oneaway = () => {
        switch (state.tag) {
            case 1: {
                const gameState_1 = state.fields[0];
                return popup(gameState_1.showOneAway);
            }
            case 2: {
                const gameState_2 = state.fields[0];
                return popup(gameState_2.showOneAway);
            }
            case 3: {
                const gameState_3 = state.fields[0];
                return popup(gameState_3.showOneAway);
            }
            case 5: {
                const gameState_4 = state.fields[0];
                return popup(gameState_4.showOneAway);
            }
            case 6: {
                const gameState_5 = state.fields[0];
                return popup(gameState_5.showOneAway);
            }
            case 7: {
                const gameState_6 = state.fields[0];
                return popup(gameState_6.showOneAway);
            }
            case 4: {
                const gameState_7 = state.fields[0];
                return popup(gameState_7.showOneAway);
            }
            default: {
                const gameState = state.fields[0];
                return popup(gameState.showOneAway);
            }
        }
    };
    const showGameOver = (value_57) => {
        if (value_57) {
            return createElement("h2", {
                className: "game-over",
                children: "Game over! :`( See you next time",
            });
        }
        else {
            return defaultOf();
        }
    };
    const gameover = () => {
        switch (state.tag) {
            case 1: {
                const gameState_9 = state.fields[0];
                return showGameOver(gameState_9.itsOver);
            }
            case 2: {
                const gameState_10 = state.fields[0];
                return showGameOver(gameState_10.itsOver);
            }
            case 3: {
                const gameState_11 = state.fields[0];
                return showGameOver(gameState_11.itsOver);
            }
            case 5: {
                const gameState_12 = state.fields[0];
                return showGameOver(gameState_12.itsOver);
            }
            case 6: {
                const gameState_13 = state.fields[0];
                return showGameOver(gameState_13.itsOver);
            }
            case 7: {
                const gameState_14 = state.fields[0];
                return showGameOver(gameState_14.itsOver);
            }
            case 4: {
                const gameState_15 = state.fields[0];
                return showGameOver(gameState_15.itsOver);
            }
            default: {
                const gameState_8 = state.fields[0];
                return showGameOver(gameState_8.itsOver);
            }
        }
    };
    const grid = () => {
        let elems_6;
        return createElement("div", createObj(ofArray([["className", "grid"], (elems_6 = cards_1(), ["children", reactApi.Children.toArray(Array.from(elems_6))])])));
    };
    return createElement("div", createObj(ofArray([["className", "container"], (elems_8 = [grid(), ctrlBtns(), attLeft(), oneaway(), gameover()], ["children", reactApi.Children.toArray(Array.from(elems_8))])])));
}

ProgramModule_run(Program_withReactSynchronous("app", ProgramModule_mkProgram(init, update, render)));

