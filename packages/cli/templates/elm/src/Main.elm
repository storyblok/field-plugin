port module Main exposing (..)

import Browser
import Html exposing (Html, button, div, h2, hr, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Json.Decode exposing (Value)


port setCount : Int -> Cmd msg


port setModalOpen : Bool -> Cmd msg


port contentChange : (FieldPluginData Value -> msg) -> Sub msg



-- To library


type alias FieldPluginData content =
    { content : content
    , isModalOpen : Bool
    }



-- Content validation


type alias Content =
    Int


defaultContent : Content
defaultContent =
    0


contentFromValue : Value -> Result Json.Decode.Error Content
contentFromValue value =
    Json.Decode.decodeValue Json.Decode.int value


fieldPluginDataFromValue : FieldPluginData Value -> FieldPluginData Content
fieldPluginDataFromValue fieldPluginData =
    case contentFromValue fieldPluginData.content of
        Ok content ->
            { content = content
            , isModalOpen = fieldPluginData.isModalOpen
            }

        Err msg ->
            { content = defaultContent
            , isModalOpen = fieldPluginData.isModalOpen
            }



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
    = Loaded (FieldPluginData Content)
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
    | SetFieldPluginData (FieldPluginData Value)


update : Msg -> Model -> ( Model, Cmd msg )
update msg model =
    case model of
        Loading ->
            case msg of
                SetFieldPluginData payload ->
                    ( Loaded (fieldPluginDataFromValue payload), Cmd.none )

                _ ->
                    ( model, Cmd.none )

        Loaded fieldPluginData ->
            case msg of
                Increment ->
                    ( model, setCount <| fieldPluginData.content + 1 )

                ToggleModal ->
                    ( model, setModalOpen <| not fieldPluginData.isModalOpen )

                SetFieldPluginData payload ->
                    ( Loaded (fieldPluginDataFromValue payload)
                    , Cmd.none
                    )



-- VIEW


view : Model -> Html Msg
view model =
    case model of
        Loaded fieldPluginData ->
            div [ class "container", class "w-full" ]
                [ h2 [] [ text "Content" ]
                , div [ class "counter-value" ] [ text (String.fromInt fieldPluginData.content) ]
                , button [ class "btn", class "w-full", onClick Increment ] [ text "Increment" ]
                , hr [] []
                , button [ class "btn", class "w-full", onClick ToggleModal ] [ text "Toggle Modal" ]
                ]

        Loading ->
            div [] [ text "Loading..." ]
