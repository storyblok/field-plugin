port module Main exposing (..)

-- Press buttons to increment and decrement a counter.
--
-- Read how it works:
--   https://guide.elm-lang.org/architecture/buttons.html
--

import Browser
import Dict exposing (Dict)
import Html exposing (Html, button, div, h2, hr, text)
import Html.Attributes exposing (class, classList)
import Html.Events exposing (onClick)


port setCount : Int -> Cmd msg


port setModalOpen : Bool -> Cmd msg


port contentChange : (FieldPluginData Content -> msg) -> Sub msg



-- To library


type alias FieldPluginData content =
    { content : content
    , isModalOpen : Bool
    }


type alias Content =
    Int



-- MAIN


type alias Flags =
    ()


main : Program Flags Model Msg
main =
    Browser.element { init = init, update = update, view = view, subscriptions = subscriptions }



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    contentChange SetFieldPluginData



-- MODEL


type Model
    = Loaded
        { fieldPluginData : FieldPluginData Content
        }
    | Loading


initialModel : Model
initialModel =
    Loading


init : Flags -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )



-- UPDATE


type Msg
    = Increment
    | ToggleModal
    | SetFieldPluginData (FieldPluginData Content)


update : Msg -> Model -> ( Model, Cmd msg )
update msg model =
    case model of
        Loading ->
            case msg of
                SetFieldPluginData fieldPluginData ->
                    ( Loaded
                        { fieldPluginData = fieldPluginData
                        }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        Loaded loaded ->
            case msg of
                Increment ->
                    ( model, setCount <| loaded.fieldPluginData.content + 1 )

                ToggleModal ->
                    ( model, setModalOpen <| not loaded.fieldPluginData.isModalOpen )

                SetFieldPluginData fieldPluginData ->
                    ( Loaded { loaded | fieldPluginData = fieldPluginData }, Cmd.none )


type JsVal
    = JsString String
    | JsInt Int
    | JsFloat Float
    | JsArray (List JsVal)
    | JsObject (Dict String JsVal)
    | JsNull


parseContent : JsVal -> Result String Content
parseContent content =
    case content of
        JsInt count ->
            Ok count

        _ ->
            Err "Failed to parse content"


buildContent : Int -> Content
buildContent count =
    count



-- VIEW


view : Model -> Html Msg
view model =
    case model of
        Loaded loaded ->
            div [ class "container", class "w-full" ]
                [ h2 [] [ text "Content" ]
                , div [ class "counter-value" ] [ text (String.fromInt loaded.fieldPluginData.content) ]
                , button [ class "btn", class "w-full", onClick Increment ] [ text "Increment" ]
                , hr [] []
                , button [ class "btn", class "w-full", onClick ToggleModal ] [ text "Toggle Modal" ]
                ]

        Loading ->
            div [] [ text "Loading..." ]
