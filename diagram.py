import graphviz

def create_features_diagram():
    # Create a new directed graph
    dot = graphviz.Graph('features', engine='dot')
    dot.attr(rankdir='TB')
    
    # Style attributes
    dot.attr('node', shape='box',
             style='rounded,filled',
             fillcolor='#E8F5E9',
             fontname='Arial',
             margin='0.3,0.2')
    
    # Main system node
    dot.node('system', 'Pest Detection\nSystem', 
            fillcolor='#81C784',
            fontsize='16')
    
    # Feature nodes
    features = {
        'feature1': 'Real-Time\nDetection & Analysis',
        'feature2': 'Multi-Pest\nClassification',
        'feature3': 'Treatment\nRecommendations'
    }
    
    # Add feature nodes
    for key, label in features.items():
        dot.node(key, label)
        
    # Add connections
    dot.edge('system', 'feature1')
    dot.edge('system', 'feature2')
    dot.edge('system', 'feature3')
    
    # Sub-features
    sub_features = {
        'f1_1': 'Image Processing\n& Classification',
        'f1_2': 'Instant Results',
        'f2_1': '12+ Pest Species\nIdentification',
        'f2_2': 'Damage Pattern\nAnalysis',
        'f3_1': 'Organic Solutions',
        'f3_2': 'Chemical Control\nOptions'
    }
    
    # Add sub-feature nodes with different color
    for key, label in sub_features.items():
        dot.node(key, label, fillcolor='#C8E6C9')
    
    # Connect sub-features
    dot.edge('feature1', 'f1_1')
    dot.edge('feature1', 'f1_2')
    dot.edge('feature2', 'f2_1')
    dot.edge('feature2', 'f2_2')
    dot.edge('feature3', 'f3_1')
    dot.edge('feature3', 'f3_2')
    
    # Save the diagram
    dot.render('static/images/features-diagram', format='png', cleanup=True)

if __name__ == '__main__':
    create_features_diagram()