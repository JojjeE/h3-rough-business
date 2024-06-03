/**
 * Rough Business Suit plugin - by Jojje
 *
 *
 * @licence LGPL-v3
 */

const { PEACOCKVER, PEACOCKVERSTRING } = require("@peacockproject/core/utils")
const { log, LogLevel } = require("@peacockproject/core/loggingInterop")

const challenges = [
	{
		Id: "855de416-43a4-4ae5-9f90-cd8a5ef671c4",
		Name: "UI_CHALLENGES_ROUGH_BUSINESS_WIRE_NAME",
		ImageName: "images/challenges/roughbusiness/wire.jpg",
		Description: "UI_CHALLENGES_ROUGH_BUSINESS_WIRE_DESC",
		Rewards: {
			MasteryXP: 4000
		},
		Drops: ["TOKEN_OUTFIT_HERO_ROUGH_BUSINESS"],
		IsPlayable: true,
		IsLocked: false,
		HideProgression: false,
		CategoryName: "UI_MENU_PAGE_PROFILE_CHALLENGES_CATEGORY_SIGNATUREKILL",
		Icon: "challenge_category_assassination",
		LocationId: "LOCATION_WET_RAT",
		ParentLocationId: "LOCATION_PARENT_WET",
		Type: "contract",
		DifficultyLevels: [],
		OrderIndex: 10000,
		XpModifier: {},
		RuntimeType: "Hit",
		Definition: {
			Constants: {
				TargetGoal: 2
			},
			Context: {
				Count: 0,
				TargetKilled: []
			},
			ContextListeners: {
				Count: {
					count: "$.Count",
					total: "$.TargetGoal",
					type: "challengecounter"
				}
			},
			Scope: "session",
			States: {
				Start: {
					Kill: [
						{
							Actions: {
								$inc: "Count",
								$pushunique: ["TargetKilled", "$Value.RepositoryId"]
							},
							Condition: {
								$and: [
									{
										$any: {
											"?": {
												$eq: ["$.#", "$Value.RepositoryId"]
											},
											in: [
												"967abcf9-2672-4e81-8fef-211aaa366747",
												"a7fd7a4f-2bee-4787-bc60-90f9dd64233b"
											]
										}
									},
									{
										$eq: ["$Value.KillItemCategory", "fiberwire"]
									},
									{
										$not: {
											$any: {
												"?": {
													$eq: ["$.#", "$Value.RepositoryId"]
												},
												in: "$.TargetKilled"
											}
										}
									}
								]
							}
						},
						{
							Condition: {
								$eq: ["$.Count", "$.TargetGoal"]
							},
							Transition: "Success"
						}
					]
				}
			}
		},
		Tags: ["assassination", "medium"],
		InclusionData: {
			ContractIds: ["3d0cbb8c-2a80-442a-896b-fea00e98768c"]
		}
	}
]

module.exports = function RoughBusinessSuit(controller) {
	if (Math.abs(PEACOCKVER) < 7000) {
		log(LogLevel.ERROR, `[Rough Business Suit] This plugin requires Peacock v7! You're on v${PEACOCKVERSTRING}!`)
		return
	}

	for (const challenge of challenges) {
		controller.challengeService.registerChallenge(challenge, "assassination", challenge.ParentLocationId, "h3")
	}

	log(LogLevel.INFO, "[Rough Business Suit] Ready. (Plugin Started)")
}
