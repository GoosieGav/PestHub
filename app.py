from flask import Flask, request, render_template, jsonify, url_for, send_from_directory
import torch
import torchvision.transforms as transforms
from PIL import Image
import io
from cnn_model import CNN
import random
import logging
import os

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_url_path='/static')

# Initialize model
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = CNN(num_classes=12).to(device)
model.load_state_dict(torch.load('best_model.pth', map_location=device))
model.eval()

# Register public_assets directory
@app.route('/assets/<path:filename>')
def public_assets(filename):
    return send_from_directory('public_assets', filename)

# Add Jinja2 template filters
@app.template_filter('get_category')
def get_category(pest_name):
    """Get the category for a pest based on its characteristics"""
    category_mapping = {
        'Ants': 'crawling',
        'Beetles': 'crawling',
        'Caterpillars': 'larval',
        'Bees': 'flying',
        'Earthworms': 'crawling',
        'Earwigs': 'crawling',
        'Grasshoppers': 'flying',
        'Moths': 'flying',
        'Slugs': 'soft-bodied',
        'Snails': 'soft-bodied',
        'Wasps': 'flying',
        'Weevils': 'crawling'
    }
    return category_mapping.get(pest_name, 'crawling')

@app.template_filter('get_category_display')
def get_category_display(pest_name):
    """Get the display name for a pest category"""
    category = get_category(pest_name)
    category_display = {
        'crawling': 'Crawling Pest',
        'flying': 'Flying Pest',
        'larval': 'Larval Pest',
        'soft-bodied': 'Soft-bodied Pest'
    }
    return category_display.get(category, 'Crawling Pest')

@app.template_filter('get_threat_level')
def get_threat_level(pest_name):
    """Get the threat level for a pest"""
    threat_mapping = {
        'Ants': 'medium',
        'Beetles': 'high',
        'Caterpillars': 'high',
        'Bees': 'low',
        'Earthworms': 'low',
        'Earwigs': 'medium',
        'Grasshoppers': 'high',
        'Moths': 'medium',
        'Slugs': 'medium',
        'Snails': 'medium',
        'Wasps': 'medium',
        'Weevils': 'high'
    }
    return threat_mapping.get(pest_name, 'medium')

@app.template_filter('get_threat_text')
def get_threat_text(pest_name):
    """Get the threat level text for display"""
    threat = get_threat_level(pest_name)
    threat_text = {
        'low': 'Low Threat',
        'medium': 'Medium Threat',
        'high': 'High Threat'
    }
    return threat_text.get(threat, 'Medium Threat')

# Class names
class_names = ['Ants', 'Bees', 'Beetles', 'Caterpillars', 'Earthworms', 'Earwigs',
               'Grasshoppers', 'Moths', 'Slugs', 'Snails', 'Wasps', 'Weevils']

# Transform for input images
transform = transforms.Compose([
    transforms.Resize((300, 300)),  # Match the original training size
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# Pest information database
pest_info = {
    'Ants': {
        'name': 'Ants',
        'scientific_name': 'Formicidae',
        'image': 'ants.jpg',
        'summary': 'Social insects that can damage crops by harvesting seeds and protecting harmful aphids.',
        'description': 'Ants are social insects that form highly organized colonies. In agricultural settings, they can become significant pests by harvesting seeds, damaging young plants, and protecting harmful insects like aphids. While some species are beneficial for soil health, certain invasive species can disrupt local ecosystems and damage crops.',
        'symptoms': [
            'Visible ant trails and extensive foraging activity around agricultural areas and storage facilities',
            'Significant damage to seedlings and young plants, particularly affecting root systems and stems',
            'Characteristic soil mounds and nesting structures appearing around plant bases and field margins',
            'Protection and farming of aphids and scale insects, leading to increased honeydew production and sooty mold',
            'Tunneling damage in wooden structures and agricultural equipment storage areas'
        ],
        'organic_treatment': [
            'Apply food-grade diatomaceous earth around affected areas and entry points, creating effective barrier zones',
            'Implement comprehensive neem oil spray treatment focusing on ant trails and nesting areas',
            'Introduce and maintain beneficial nematode populations in affected soil areas',
            'Use botanical ant repellents containing citrus, cinnamon, or mint oils around sensitive areas',
            'Deploy targeted organic bait stations using borax and sugar combinations in high-activity zones'
        ],
        'chemical_treatment': [
            'Apply professional-grade pyrethroid-based insecticides around perimeter areas and entry points',
            'Use specialized boric acid bait formulations designed for specific ant species control',
            'Implement strategic placement of granular insecticides around nesting sites and foraging areas',
            'Deploy long-lasting residual barrier sprays containing fipronil or similar active ingredients',
            'Utilize systematic soil treatments with imidacloprid for severe infestations'
        ],
        'prevention': [
            'Implement comprehensive field sanitation practices, including regular removal of fallen fruit, crop debris, and careful management of green waste materials.',
            'Establish effective physical barriers using combinations of diatomaceous earth, copper tape, and specialized ant-proof materials around vulnerable areas.',
            'Maintain optimal irrigation management through careful scheduling and monitoring, preventing conditions that attract ant colonies.',
            'Conduct regular monitoring using bait stations and systematic field inspections to detect early ant activity.',
            'Create and maintain buffer zones between crops and known ant-prone areas, using repellent plants and natural barriers.',
            'Implement strategic planting schedules based on local ant activity patterns and seasonal variations.',
            'Develop integrated pest management programs combining biological controls, habitat modification, and cultural practices.'
        ],
        'common_species': [
            {
                'name': 'Carpenter Ants',
                'description': 'These large black or red ants are notorious for nesting in wood, causing extensive structural damage to agricultural buildings and trees.'
            },
            {
                'name': 'Fire Ants',
                'description': 'Known for their aggressive behavior and painful stings, these red ants form large mounds in fields and can severely damage crop root systems.'
            },
            {
                'name': 'Argentine Ants',
                'description': 'Forming massive super colonies, these small brown ants are particularly problematic as they protect and farm harmful crop-damaging insects like aphids.'
            }
        ]
    },
    'Beetles': {
        'name': 'Beetles',
        'scientific_name': 'Coleoptera',
        'image': 'beetles.jpg',
        'summary': 'Hard-shelled insects that damage crops in both adult and larval stages through feeding.',
        'description': 'Agricultural beetle pests comprise various species that can cause significant crop damage. These insects are characterized by their hardened wing cases and strong mandibles. Both adult beetles and their larvae can be destructive, feeding on leaves, stems, roots, and stored grains, making them a serious concern for farmers worldwide.',
        'symptoms': [
            'Irregular holes in leaves and plant tissue',
            'Wilting or dying young plants',
            'Tunnels in stems and roots',
            'Presence of frass (insect droppings)',
            'Root system damage'
        ],
        'organic_treatment': [
            'Introduce beneficial nematodes to soil',
            'Apply diatomaceous earth around plants',
            'Use botanical insecticides like neem oil',
            'Practice crop rotation',
            'Install row covers during peak seasons'
        ],
        'chemical_treatment': [
            'Apply systemic insecticides during early growth stages for long-term protection',
            'Use targeted soil treatments with imidacloprid for root-feeding species',
            'Implement foliar sprays with pyrethroid-based products for immediate control',
            'Apply granular insecticides around plant bases for persistent protection',
            'Use specific beetle-targeted formulations based on species identification'
        ],
        'prevention': [
            'Implement proper crop rotation cycles of 3-4 years to break pest life cycles and reduce beetle populations in affected areas.',
            'Maintain healthy soil through regular testing and appropriate amendments to promote strong plant growth and natural resistance.',
            'Install physical barriers such as fine mesh netting or row covers during peak beetle activity periods, ensuring regular maintenance and prompt repair of any compromised sections.',
            'Practice regular field monitoring and scouting to detect early signs of beetle presence or damage, using bait stations and pheromone traps for effective detection.',
            'Remove plant debris and maintain clean field conditions to reduce overwintering sites, incorporating strict cleaning schedules for equipment and storage areas.',
            'Time planting to avoid peak beetle activity periods specific to your region, coordinating with local pest forecasting systems for optimal timing.',
            'Use companion planting with repellent crops like catnip, garlic, or marigolds to deter beetle activity and protect vulnerable crops.'
        ],
        'common_species': [
            {
                'name': 'Japanese Beetle',
                'description': 'Distinguished by their metallic green appearance, these beetles are devastating pests that skeletonize leaves while their larvae severely damage root systems.'
            },
            {
                'name': 'Colorado Potato Beetle',
                'description': 'Recognizable by their yellow-striped appearance, these specialized pests cause extensive damage to potato crops and related plants throughout all life stages.'
            },
            {
                'name': 'June Bugs',
                'description': 'These nocturnal brown beetles pose a dual threat, with adults damaging foliage while their larvae (white grubs) devastate root systems of various crops.'
            }
        ]
    },
    'Caterpillars': {
        'name': 'Caterpillars',
        'scientific_name': 'Lepidoptera larvae',
        'image': 'caterpillars.jpg',
        'summary': 'Voracious larvae of butterflies and moths that can quickly defoliate plants and damage fruits.',
        'description': 'Caterpillars are the larval stage of butterflies and moths. While they eventually transform into beautiful adult insects, their larval form can be extremely damaging to crops. These voracious feeders can quickly defoliate plants and bore into fruits, causing substantial economic losses in agriculture.',
        'symptoms': [
            'Large irregular holes in leaves',
            'Skeletonized leaves',
            'Presence of silk threads and webbing',
            'Fruit damage with entry holes',
            'Heavy frass accumulation'
        ],
        'organic_treatment': [
            'Apply Bacillus thuringiensis (Bt) sprays',
            'Release parasitic wasps as biological control',
            'Use insecticidal soaps for small caterpillars',
            'Hand-pick larger specimens',
            'Apply neem oil treatments'
        ],
        'chemical_treatment': [
            'Use selective insect growth regulators (IGRs) that target lepidopteran pests',
            'Apply systemic insecticides early in the growing season for long-term protection',
            'Implement spot treatments with pyrethroid-based products for immediate control',
            'Use specialty formulations for boring species that enter plant tissue',
            'Apply residual insecticides during peak moth flight periods'
        ],
        'prevention': [
            'Monitor fields regularly using pheromone traps to detect adult moth activity and time interventions effectively.',
            'Maintain field sanitation by removing crop residues that could harbor overwintering pupae, incorporating strict cleaning schedules for equipment and storage areas.',
            'Install physical barriers such as row covers or netting during peak egg-laying periods, ensuring regular maintenance and prompt repair of any compromised sections.',
            'Practice deep plowing after harvest to disrupt pupal stages in the soil, reducing caterpillar populations in affected areas.',
            'Use trap crops to concentrate pest populations away from main crops, ensuring proper management and disposal of trap crop residues.',
            'Time plantings to avoid peak caterpillar periods in your region, coordinating with local pest forecasting systems for optimal timing.',
            'Establish habitat for natural predators like birds and beneficial insects to enhance biological control of caterpillar populations.'
        ],
        'common_species': [
            {
                'name': 'Tomato Hornworm',
                'description': 'Instantly recognizable by their large size and distinctive horn, these bright green caterpillars are voracious feeders that can quickly defoliate tomato plants.'
            },
            {
                'name': 'Cabbage Looper',
                'description': 'Named for their distinctive looping movement, these green caterpillars are particularly destructive to cabbage and other cruciferous vegetables.'
            },
            {
                'name': 'Fall Armyworm',
                'description': 'Moving in devastating swarms, these aggressive feeders can rapidly destroy large areas of field crops, earning their military-inspired name.'
            }
        ]
    },
    'Bees': {
        'name': 'Bees',
        'scientific_name': 'Apidae',
        'image': 'bees.jpg',
        'summary': 'Essential pollinators that can occasionally become structural pests in agricultural settings.',
        'description': 'While bees are essential pollinators in agriculture, certain species can become structural pests or cause concerns in agricultural settings. Management focuses on balancing their beneficial roles with preventing damage to wooden structures and ensuring safe working conditions.',
        'symptoms': [
            'Extensive boring damage and tunnels in wooden agricultural structures and equipment',
            'Visible bee activity and nesting sites near crop production and storage areas',
            'Wood shavings and sawdust accumulation beneath affected structures',
            'Weakening of structural integrity in wooden buildings and supports',
            'Interference with harvesting operations and worker safety concerns'
        ],
        'organic_treatment': [
            'Install dedicated bee houses and alternative nesting sites away from sensitive areas',
            'Apply natural repellents containing almond oil or citrus extracts to affected wood',
            'Implement sound and vibration deterrent systems in problem areas',
            'Use physical barriers and screens to protect vulnerable structures',
            'Deploy natural bee-attracting plants and crops away from agricultural buildings'
        ],
        'chemical_treatment': [
            'Apply specialized wood preservatives and sealants to prevent nesting activity',
            'Use targeted foam applications for existing nest removal and cavity treatment',
            'Implement residual barrier treatments around sensitive structural areas',
            'Deploy microencapsulated repellents for long-term protection',
            'Apply pyrethrin-based products only as a last resort for emergency control'
        ],
        'prevention': [
            'Conduct comprehensive structural surveys to identify and seal potential nesting sites in agricultural buildings and equipment.',
            'Implement regular maintenance programs including wood treatment and protective coating applications for vulnerable structures.',
            'Establish designated bee-friendly zones away from critical agricultural infrastructure and operations.',
            'Develop and maintain proper spacing between managed honeybee colonies and sensitive agricultural areas.',
            'Create physical barriers using appropriate materials while ensuring adequate ventilation in agricultural structures.',
            'Schedule outdoor activities and harvesting operations around peak bee activity periods.',
            'Design integrated pest management strategies that protect both agricultural interests and beneficial pollinator populations.'
        ],
        'common_species': [
            {
                'name': 'Carpenter Bees',
                'description': 'These robust solitary bees create extensive tunnel networks in wooden structures, leading to significant structural deterioration in agricultural buildings.'
            },
            {
                'name': 'Mining Bees',
                'description': 'While valuable as pollinators, these ground-nesting bees can disrupt agricultural operations by creating extensive burrow networks in field soils.'
            },
            {
                'name': 'Honey Bees',
                'description': 'Essential for pollination but can become problematic when establishing colonies in agricultural structures, requiring careful management and professional relocation.'
            }
        ]
    },
    'Wasps': {
        'name': 'Wasps',
        'scientific_name': 'Vespidae',
        'image': 'wasps.jpg',
        'summary': 'Both beneficial predators and potential pests requiring careful management in agricultural environments.',
        'description': 'Wasps play dual roles in agriculture as both beneficial predators of pest insects and potential pests themselves. While they contribute to natural pest control, their aggressive defense behavior and tendency to build nests in agricultural structures requires careful management.',
        'symptoms': [
            'Presence of paper-like nests in agricultural structures and equipment',
            'Aggressive defensive behavior around nesting sites disrupting farm operations',
            'Worker interference during harvest and fruit collection activities',
            'Damage to ripening fruits and sweet crops during foraging',
            'Increased stress on livestock and farm workers due to wasp activity'
        ],
        'organic_treatment': [
            'Install strategically placed wasp traps with natural attractants around affected areas',
            'Apply essential oil-based deterrent sprays containing peppermint or clove oil',
            'Use physical removal of nests during inactive periods (early morning/late evening)',
            'Deploy natural predator attractants to encourage biological control',
            'Implement mechanical barriers and screens in sensitive areas'
        ],
        'chemical_treatment': [
            'Apply targeted aerosol treatments for immediate nest control when necessary',
            'Use residual barrier sprays containing deltamethrin around structure perimeters',
            'Implement dust applications for void and cavity treatments where nests occur',
            'Deploy microencapsulated products for longer-lasting control around buildings',
            'Apply synthetic pheromone-based wasp lures in trap systems'
        ],
        'prevention': [
            'Conduct regular structural inspections to identify and seal potential nesting sites before wasp establishment.',
            'Maintain comprehensive sanitation protocols around fruit processing and storage areas to reduce attractants.',
            'Install and maintain proper screening on building openings and ventilation systems.',
            'Establish clear safety protocols and response plans for wasp encounters during farm operations.',
            'Create designated buffer zones between processing areas and known wasp attractants.',
            'Coordinate timing of outdoor activities to avoid peak wasp activity periods.',
            'Implement integrated pest management strategies that preserve beneficial wasp activities while protecting sensitive areas.'
        ],
        'common_species': [
            {
                'name': 'Yellow Jackets',
                'description': 'Highly aggressive ground-nesters that pose significant risks during harvest periods, known for their powerful stings and persistent defense of their territory.'
            },
            {
                'name': 'Paper Wasps',
                'description': 'Though less aggressive than other species, these wasps build exposed nests in agricultural structures and can interfere with farming operations.'
            },
            {
                'name': 'Hornets',
                'description': 'The largest of the social wasps, they construct massive aerial nests and establish large defensive territories that can disrupt agricultural activities.'
            }
        ]
    },
    'Earthworms': {
        'name': 'Earthworms',
        'scientific_name': 'Lumbricidae',
        'image': 'earthworms.jpg',
        'summary': 'Generally beneficial soil organisms that can sometimes disrupt soil structure and root systems.',
        'description': 'While earthworms are generally beneficial for soil health, in some agricultural contexts they can become problematic, especially in areas where non-native species have been introduced. They can affect soil structure, nutrient cycling, and potentially impact sensitive plant root systems.',
        'symptoms': [
            'Excessive soil castings on surface causing rough and uneven terrain for farming operations',
            'Significant changes in soil structure affecting drainage and root development',
            'Visible burrow networks disrupting established root systems and soil profiles',
            'Altered soil chemical composition affecting nutrient availability to crops',
            'Interference with irrigation systems and water distribution patterns'
        ],
        'organic_treatment': [
            'Implement controlled irrigation schedules to manage soil moisture levels',
            'Apply organic soil amendments to modify habitat suitability',
            'Use cover crop management to regulate earthworm populations',
            'Deploy targeted biological control organisms when appropriate',
            'Adjust soil pH through organic amendments to discourage problem species'
        ],
        'chemical_treatment': [
            'Apply specialized vermicides only in severe cases with careful consideration',
            'Use targeted soil treatments that minimize impact on beneficial species',
            'Implement pH modifiers for long-term population management',
            'Deploy controlled-release treatments in problem areas',
            'Apply selective biocontrol agents for specific species management'
        ],
        'prevention': [
            'Develop comprehensive soil monitoring programs to track earthworm population dynamics and their effects on crop systems.',
            'Implement strategic irrigation management practices that discourage problematic earthworm activity while maintaining crop health.',
            'Establish appropriate drainage systems to prevent soil conditions that favor excessive earthworm proliferation.',
            'Create buffer zones in sensitive planting areas using modified soil profiles and barriers.',
            'Maintain detailed records of soil structure changes and earthworm activity to inform management decisions.',
            'Select crop varieties and cultivation methods that are less susceptible to earthworm-related disruption.',
            'Design integrated soil management approaches that balance beneficial and problematic earthworm impacts.'
        ],
        'common_species': [
            {
                'name': 'European Nightcrawler',
                'description': 'These deep-burrowing earthworms create extensive tunnel networks that can significantly alter soil structure and water movement patterns in agricultural fields.'
            },
            {
                'name': 'Red Wiggler',
                'description': 'Though beneficial in composting, these surface-dwelling worms can multiply rapidly in agricultural settings, potentially disrupting the natural decomposition balance.'
            },
            {
                'name': 'Alabama Jumper',
                'description': 'An invasive species known for their aggressive soil modification, these worms can dramatically alter established soil ecosystems and displace beneficial native species.'
            }
        ]
    },
    'Earwigs': {
        'name': 'Earwigs',
        'scientific_name': 'Dermaptera',
        'image': 'earwigs.jpg',
        'summary': 'Nocturnal insects with distinctive pincers that feed on seedlings, fruits, and flowers.',
        'description': 'Earwigs are nocturnal insects that can become agricultural pests by feeding on seedlings, fruits, and flowers. They are characterized by their pincer-like appendages and can cause significant damage to crops.',
        'symptoms': [
            'Irregular holes in leaves and flowers',
            'Damage to fruits and vegetables',
            'Presence of earwigs in soil and under debris',
            'Seedling damage and stunted growth',
            'Visible frass near feeding sites'
        ],
        'organic_treatment': [
            'Use diatomaceous earth around plants',
            'Apply neem oil sprays',
            'Set up traps using rolled-up newspapers or cardboard',
            'Introduce natural predators like birds and toads',
            'Maintain clean and debris-free fields'
        ],
        'chemical_treatment': [
            'Apply pyrethroid-based insecticides for immediate control',
            'Use bait formulations containing boric acid',
            'Implement residual sprays around affected areas',
            'Deploy granular insecticides for soil treatment',
            'Apply targeted treatments during peak activity periods'
        ],
        'prevention': [
            'Maintain clean fields by removing debris and organic matter that can harbor earwigs.',
            'Install physical barriers around sensitive crops using fine mesh or row covers.',
            'Practice crop rotation to disrupt earwig life cycles and reduce populations.',
            'Monitor fields regularly for early signs of earwig activity and damage.',
            'Use companion planting with repellent crops like garlic and marigolds.',
            'Establish habitat for natural predators to enhance biological control.',
            'Implement integrated pest management strategies combining cultural, biological, and chemical controls.'
        ],
        'common_species': [
            {
                'name': 'European Earwig',
                'description': 'The most widespread agricultural pest among earwigs, known for causing extensive damage to seedlings and soft fruits while hiding in dark, moist areas.'
            },
            {
                'name': 'Ring-legged Earwig',
                'description': 'Distinguished by their ringed legs, these smaller earwigs target delicate plant tissues and can cause significant damage to flowering crops.'
            },
            {
                'name': 'Maritime Earwig',
                'description': 'Common in coastal agricultural areas, these adaptable pests can thrive in various crop environments and cause widespread damage to young plants.'
            }
        ]
    },
    'Grasshoppers': {
        'name': 'Grasshoppers',
        'scientific_name': 'Orthoptera',
        'image': 'grasshoppers.jpg',
        'summary': 'Highly mobile pests capable of forming swarms and causing widespread crop damage.',
        'description': 'Grasshoppers are voracious feeders that can devastate crops by consuming leaves, stems, and fruits. They are highly mobile and can form swarms, causing widespread agricultural damage.',
        'symptoms': [
            'Defoliation of plants',
            'Irregular holes in leaves and stems',
            'Damage to fruits and vegetables',
            'Presence of grasshoppers in fields',
            'Stunted plant growth due to feeding'
        ],
        'organic_treatment': [
            'Use neem oil sprays',
            'Introduce natural predators like birds and spiders',
            'Apply diatomaceous earth around plants',
            'Set up physical barriers like row covers',
            'Use biological control agents like Nosema locustae'
        ],
        'chemical_treatment': [
            'Apply insecticides containing carbaryl or malathion',
            'Use bait formulations for targeted control',
            'Implement foliar sprays during peak activity periods',
            'Deploy granular insecticides around plant bases',
            'Apply systemic treatments for long-term protection'
        ],
        'prevention': [
            'Monitor fields regularly for early signs of grasshopper activity and damage.',
            'Establish buffer zones using trap crops to concentrate grasshopper populations away from main crops.',
            'Use physical barriers like fine mesh netting to protect sensitive crops.',
            'Practice crop rotation to disrupt grasshopper life cycles and reduce populations.',
            'Maintain clean fields by removing debris and organic matter that can harbor grasshoppers.',
            'Introduce natural predators to enhance biological control.',
            'Implement integrated pest management strategies combining cultural, biological, and chemical controls.'
        ],
        'common_species': [
            {
                'name': 'Migratory Grasshopper',
                'description': 'Capable of forming devastating swarms, these highly mobile pests can rapidly move through agricultural areas, leaving widespread crop destruction in their wake.'
            },
            {
                'name': 'Differential Grasshopper',
                'description': 'One of the largest crop-threatening species, these robust grasshoppers are particularly damaging to corn, soybeans, and alfalfa fields.'
            },
            {
                'name': 'Red-legged Grasshopper',
                'description': 'Though smaller than other species, these numerous grasshoppers can cause extensive damage to pastures and cereal crops through their persistent feeding.'
            }
        ]
    },
    'Moths': {
        'name': 'Moths',
        'scientific_name': 'Lepidoptera',
        'image': 'moths.jpg',
        'summary': 'Nocturnal insects whose larvae cause significant crop damage through feeding.',
        'description': 'Moths are nocturnal insects that can become agricultural pests during their larval stage. They feed on leaves, stems, and fruits, causing significant damage to crops.',
        'symptoms': [
            'Creating holes in clothing, carpets, and other textiles',
            'Irregular holes in leaves and stems',
            'Damage to fruits and vegetables',
            'Visible frass near feeding sites',
            'Stunted plant growth due to larval feeding'
        ],
        'organic_treatment': [
            'Use pheromone traps to monitor and control moth populations',
            'Apply Bacillus thuringiensis (Bt) sprays',
            'Introduce natural predators like birds and bats',
            'Use insecticidal soaps for small larvae',
            'Maintain clean and debris-free fields'
        ],
        'chemical_treatment': [
            'Apply pyrethroid-based insecticides for immediate control',
            'Use systemic treatments for long-term protection',
            'Implement foliar sprays during peak activity periods',
            'Deploy granular insecticides for soil treatment',
            'Apply targeted treatments for boring species'
        ],
        'prevention': [
            'Monitor fields regularly for early signs of moth activity and damage.',
            'Use pheromone traps to detect adult moths and time interventions effectively.',
            'Install physical barriers like row covers to protect sensitive crops.',
            'Practice crop rotation to disrupt moth life cycles and reduce populations.',
            'Maintain clean fields by removing debris and organic matter that can harbor moths.',
            'Introduce natural predators to enhance biological control.',
            'Implement integrated pest management strategies combining cultural, biological, and chemical controls.'
        ],
        'common_species': [
            {
                'name': 'Corn Earworm',
                'description': 'A devastating pest whose larvae bore directly into corn ears, causing extensive damage to kernels and creating entry points for disease.'
            },
            {
                'name': 'Diamondback Moth',
                'description': 'A serious threat to cruciferous crops, these moths have developed resistance to many pesticides and can destroy entire fields of cabbage and related vegetables.'
            },
            {
                'name': 'Codling Moth',
                'description': 'The primary pest of apple orchards worldwide, their larvae tunnel into fruits, making them unmarketable and creating pathways for disease.'
            }
        ]
    },
    'Slugs': {
        'name': 'Slugs',
        'scientific_name': 'Gastropoda',
        'image': 'slugs.jpg',
        'summary': 'Soft-bodied mollusks that thrive in moist conditions and feed on various plant parts.',
        'description': 'Slugs are soft-bodied mollusks that can become serious agricultural pests by feeding on leaves, stems, and fruits. They thrive in moist environments and can cause significant damage to crops.',
        'symptoms': [
            'Irregular holes in leaves and stems',
            'Damage to fruits and vegetables',
            'Presence of slime trails on plants and soil',
            'Stunted plant growth due to feeding',
            'Visible slugs in fields during nighttime'
        ],
        'organic_treatment': [
            'Use diatomaceous earth around plants',
            'Apply iron phosphate-based slug baits',
            'Set up traps using beer or yeast solutions',
            'Introduce natural predators like ducks and toads',
            'Maintain clean and debris-free fields'
        ],
        'chemical_treatment': [
            'Apply metaldehyde-based slug baits for immediate control',
            'Use iron phosphate treatments for long-term protection',
            'Implement foliar sprays during peak activity periods',
            'Deploy granular treatments around plant bases',
            'Apply targeted treatments for severe infestations'
        ],
        'prevention': [
            'Monitor fields regularly for early signs of slug activity and damage.',
            'Maintain clean fields by removing debris and organic matter that can harbor slugs.',
            'Use physical barriers like copper tape to protect sensitive crops.',
            'Practice crop rotation to disrupt slug life cycles and reduce populations.',
            'Introduce natural predators to enhance biological control.',
            'Implement integrated pest management strategies combining cultural, biological, and chemical controls.'
        ],
        'common_species': [
            {
                'name': 'Gray Garden Slug',
                'description': 'A prevalent agricultural pest that feeds voraciously on young plants and leafy vegetables, leaving characteristic slime trails and ragged holes in crops.'
            },
            {
                'name': 'Great Gray Slug',
                'description': 'One of the largest slug species, capable of causing extensive damage to both ground-level crops and climbing to damage fruits and vegetables on plants.'
            },
            {
                'name': 'Black Slug',
                'description': 'An aggressive species that thrives in wet conditions, known for their ability to devastate seedlings and young plants in market gardens.'
            }
        ]
    },
    'Snails': {
        'name': 'Snails',
        'scientific_name': 'Gastropoda',
        'image': 'snails.jpg',
        'summary': 'Shelled mollusks that damage crops in moist conditions through persistent feeding.',
        'description': 'Snails are shelled mollusks that can become serious agricultural pests by feeding on leaves, stems, and fruits. They thrive in moist environments and can cause significant damage to crops.',
        'symptoms': [
            'Irregular holes in leaves and stems',
            'Damage to fruits and vegetables',
            'Presence of slime trails on plants and soil',
            'Stunted plant growth due to feeding',
            'Visible snails in fields during nighttime'
        ],
        'organic_treatment': [
            'Use diatomaceous earth around plants',
            'Apply iron phosphate-based snail baits',
            'Set up traps using beer or yeast solutions',
            'Introduce natural predators like ducks and toads',
            'Maintain clean and debris-free fields'
        ],
        'chemical_treatment': [
            'Apply metaldehyde-based snail baits for immediate control',
            'Use iron phosphate treatments for long-term protection',
            'Implement foliar sprays during peak activity periods',
            'Deploy granular treatments around plant bases',
            'Apply targeted treatments for severe infestations'
        ],
        'prevention': [
            'Monitor fields regularly for early signs of snail activity and damage.',
            'Maintain clean fields by removing debris and organic matter that can harbor snails.',
            'Use physical barriers like copper tape to protect sensitive crops.',
            'Practice crop rotation to disrupt snail life cycles and reduce populations.',
            'Introduce natural predators to enhance biological control.',
            'Implement integrated pest management strategies combining cultural, biological, and chemical controls.'
        ],
        'common_species': [
            {
                'name': 'Brown Garden Snail',
                'description': 'The most common agricultural snail pest worldwide, these adaptable mollusks feed on a wide variety of crops and can climb to reach fruits and leaves.'
            },
            {
                'name': 'White-lipped Snail',
                'description': 'Despite their smaller size, these prolific breeders can quickly establish large populations that cause significant damage to garden crops and ornamentals.'
            },
            {
                'name': 'Giant African Land Snail',
                'description': 'An invasive species that poses a severe threat to agriculture, capable of consuming over 500 different plant species and spreading plant diseases.'
            }
        ]
    },
    'Weevils': {
        'name': 'Weevils',
        'scientific_name': 'Curculionidae',
        'image': 'weevils.jpg',
        'summary': 'Small beetles with distinctive snouts that primarily damage seeds and stored products.',
        'description': 'Weevils are small beetles that can become serious agricultural pests by feeding on seeds, grains, and stored products. They are characterized by their elongated snouts and can cause significant damage to crops.',
        'symptoms': [
            'Presence of weevils in stored grains and seeds',
            'Damage to fruits and vegetables',
            'Irregular holes in leaves and stems',
            'Stunted plant growth due to feeding',
            'Visible weevils in fields during daytime'
        ],
        'organic_treatment': [
            'Use diatomaceous earth in storage areas',
            'Apply neem oil sprays',
            'Set up traps using pheromone lures',
            'Introduce natural predators like birds and spiders',
            'Maintain clean and debris-free storage areas'
        ],
        'chemical_treatment': [
            'Apply pyrethroid-based insecticides for immediate control',
            'Use systemic treatments for long-term protection',
            'Implement foliar sprays during peak activity periods',
            'Deploy granular treatments around plant bases',
            'Apply targeted treatments for severe infestations'
        ],
        'prevention': [
            'Monitor storage areas regularly for early signs of weevil activity and damage.',
            'Maintain clean and debris-free storage areas to reduce weevil populations.',
            'Use physical barriers like fine mesh netting to protect stored products.',
            'Practice crop rotation to disrupt weevil life cycles and reduce populations.',
            'Introduce natural predators to enhance biological control.',
            'Implement integrated pest management strategies combining cultural, biological, and chemical controls.'
        ],
        'common_species': [
            {
                'name': 'Rice Weevil',
                'description': 'A primary pest of stored grains, these small but destructive beetles can destroy entire grain stores through their feeding and reproductive activities.'
            },
            {
                'name': 'Boll Weevil',
                'description': 'Historically one of the most destructive cotton pests, these specialized weevils attack cotton squares and bolls, causing devastating crop losses.'
            },
            {
                'name': 'Granary Weevil',
                'description': 'A serious pest of stored cereals, these weevils can render entire grain stores unusable through their feeding damage and contamination.'
            }
        ]
    }
}

def predict_image(image_bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        tensor = transform(image).unsqueeze(0).to(device)
        
        # Add logging to debug tensor shape
        logger.info(f"Input tensor shape: {tensor.shape}")
        
        with torch.no_grad():
            outputs = model(tensor)
            _, predicted = torch.max(outputs, 1)
            confidence = torch.nn.functional.softmax(outputs, dim=1)[0]
        
        return class_names[predicted[0]], float(confidence[predicted[0]])
    except Exception as e:
        logger.error(f"Error in predict_image: {str(e)}")
        raise

def is_pest(class_name, confidence):
    # Placeholder function - in reality, this would use the actual model's confidence threshold
    # and potentially additional verification steps
    return confidence > 0.5

@app.route('/', methods=['GET'])
def home():
    return render_template('home.html')

@app.route('/classify', methods=['GET'])
def classify():
    return render_template('index.html')

@app.route('/about', methods=['GET'])
def about():
    return render_template('about.html')

@app.route('/pest/<pest_name>')
def pest_details(pest_name):
    if pest_name in pest_info:
        return render_template('pest_info.html', pest=pest_info[pest_name])
    return render_template('404.html'), 404

@app.route('/pests')
def pest_directory():
    return render_template('pest_directory.html', pests=pest_info)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'})
    
    file = request.files['file']
    if not file.filename:
        return jsonify({'error': 'No file selected'})
    
    try:
        img_bytes = file.read()
        # Use real model prediction instead of placeholder
        class_name, confidence = predict_image(img_bytes)
        is_pest_result = is_pest(class_name, confidence)
        
        logger.info(f'Prediction complete: {class_name} with confidence {confidence:.2%}')
        
        return jsonify({
            'class_name': class_name,
            'confidence': f'{confidence:.2%}',
            'is_pest': is_pest_result,
            'message': 'PEST DETECTED!' if is_pest_result else 'NOT A PEST',
            'info_url': f'/pest/{class_name}'
        })
        
    except Exception as e:
        logger.error(f'Error during prediction: {str(e)}')
        return jsonify({'error': f'Error processing image: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True, port=8000)
