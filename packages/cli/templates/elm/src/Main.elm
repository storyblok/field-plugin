port module Main exposing (..)

-- Press buttons to increment and decrement a counter.
--
-- Read how it works:
--   https://guide.elm-lang.org/architecture/buttons.html
--

import Browser
import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)


port setCount : Int -> Cmd msg


port contentChange : (Int -> msg) -> Sub msg



-- MAIN


type alias Flags =
    ()


main : Program Flags Model Msg
main =
    Browser.element { init = init, update = update, view = view, subscriptions = subscriptions }



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    contentChange SetContent



-- MODEL


type alias Model =
    Int


initialModel =
    0


init : Flags -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )



-- UPDATE


type Msg
    = Increment
    | Decrement
    | SetContent Model


update : Msg -> Model -> ( Model, Cmd msg )
update msg model =
    case msg of
        Increment ->
            let
                newModel =
                    model + 1
            in
            ( newModel, setCount newModel )

        Decrement ->
            let
                newModel =
                    model - 1
            in
            ( newModel, setCount newModel )

        SetContent newContent ->
            ( newContent, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ button [ onClick Decrement ] [ text "-" ]
        , div [] [ text (String.fromInt model) ]
        , button [ onClick Increment ] [ text "+" ]
        ]
