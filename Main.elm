import Html exposing (..)
import Html.App as App
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import String

main =
  App.program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }


-- Model

type alias Model =
  { title : String
  , sections: List Section
  }

type alias Section =
  { title : String
  , items : List Subsection
  }

type alias Subsection =
  { title : String
  , items : List BulletPoint
  }

type alias BulletPoint =
  { content : String
  }

subsections =
  { experience =
    [ Subsection "Haven"
      [ BulletPoint "Founding team member"
      , BulletPoint "Full-stack JavaScript (Node, Angular, Loopback) developer"
      , BulletPoint "Senior-level engineer"
      ]
    , Subsection "GraphScience"
      [ BulletPoint "Full-stack (Rails, Angular) developer"
      , BulletPoint "Integrated with the Facebook Ads API"
      , BulletPoint "Engineering lead until company acquisition by Centro"
      ]
    ]
  , projects =
    [ Subsection "LgBook"
      [ BulletPoint "An app to track good habits and short-term goals"
      , BulletPoint "Built to learn React, Redux, and ES6"
      , BulletPoint "Integrated with the Facebook Messenger API"
      ]
    , Subsection "This site!"
      [ BulletPoint "A simple personal website"
      , BulletPoint "Built to learn Elm"
      ]
    ]
  , education =
    [ Subsection "UCLA"
      [ BulletPoint "B.A in History (Middle East)"
      , BulletPoint "Additional studies in Music, Computer Science, Korean, Arabic"
      ]
    ]
  }

sections =
  [ Section "Experience" subsections.experience
  , Section "Projects" subsections.projects
  , Section "Education" subsections.education
  ]


init : (Model, Cmd Msg)
init =
  (Model "Alex Reichert" sections, Cmd.none)


-- Updates

type Msg
  = NoOp

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    NoOp ->
      model ! []


-- Subscriptions

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none


-- View

view : Model -> Html Msg
view model =
  div [ class "alex-container" ]
    [ h1 [ class "alex-header" ]
      [ text (model.title) ]
    , listSections model.sections
    , div [ class "footer" ]
      [ text "Copyright 2016 Alex Reichert" ]
    ]


listSections : List Section -> Html Msg
listSections sections =
  div [] (List.map viewSection sections)

viewSection : Section -> Html Msg
viewSection section =
  div [ class "alex-component" ]
    [ h3
      [ class "section-header" ]
      [ text section.title ]
    , listSubsections section.items
    ]

listSubsections : List Subsection -> Html Msg
listSubsections subs =
  div []
    (List.map viewSubsection subs)


viewSubsection : Subsection -> Html Msg
viewSubsection sub =
  div [ class "alex-subsection" ]
    [ span []
      [ text sub.title ]
    , listBulletPoints sub.items
    ]

listBulletPoints : List BulletPoint -> Html Msg
listBulletPoints points =
  ul [] (List.map viewBulletPoint points)


viewBulletPoint : BulletPoint -> Html Msg
viewBulletPoint point =
  li [ class "alex-bullet-point" ]
    [ text point.content ]
